import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { PrismaClient } from "@prisma/client";
import twilio from "twilio";
import { createUltravoxCall } from "../services/ultravox.service.js";
import { extractStructuredTranscript } from "../services/ai.service.js";
import redis from "../config/redis.js";

const prisma = new PrismaClient();
const VoiceResponse = twilio.twiml.VoiceResponse;

/**
 * @desc    Receive webhook from Ultravox when an AI call finishes
 * @route   POST /api/webhooks/ultravox
 * @access  Public (Should verify signature in prod)
 */
export const handleUltravoxWebhook = asyncHandler(async (req, res) => {
  // 1. Extract call details from Ultravox payload
  const { 
    call_id, 
    patient_id, 
    transcript, 
    extracted_symptoms, 
    risk_score, 
    requested_appointment_time 
  } = req.body;

  if (!call_id || !patient_id) {
    throw new ApiError(
      400,
      "Missing required webhook parameters: call_id or patient_id",
    );
  }

  console.log(
    `[Webhook] Received call data for Patient: ${patient_id}, Risk: ${risk_score}`,
  );

  // 2. Map risk score to enum/string
  const finalRiskScore = risk_score || "Low";

  // Generate structured transcript directly using AI LLM Extractors
  const structuredTranscript = await extractStructuredTranscript(transcript || "");

  // Let's create an appointment block if there's a proposed date/time
  // Ensure we negotiate a pending booking rather than guaranteed.
  let proposedAppointmentData = null;
  if (requested_appointment_time || structuredTranscript.Requested_Time) {
    const timeMatch = requested_appointment_time || structuredTranscript.Requested_Time;
    
    // We create a dummy proposed_time or let the frontend parse it. 
    // Usually you'd use a datetime parser here, but for now we set it 24h away as mock.
    const dateObj = new Date();
    dateObj.setHours(dateObj.getHours() + 24);
    
    try {
      proposedAppointmentData = await prisma.appointment.create({
        data: {
          patient_id,
          proposed_time: dateObj,
          status: "PENDING"
        }
      });
      console.log(`[Webhook] Created PENDING appointment for ${patient_id}`);
    } catch (e) {
      console.error("[Webhook] Errored creating appointment", e.message);
    }
  }

  // 3. Save to Database (Call Logs table)
  let callLog;
  try {
    callLog = await prisma.callLog.upsert({
      where: { call_id },
      update: {
        transcript: transcript || "",
        structured_transcript: structuredTranscript,
        symptoms: extracted_symptoms || [],
        risk_classification: finalRiskScore,
        completed_at: new Date(),
        status: "completed",
      },
      create: {
        call_id,
        patient_id,
        status: "completed",
        transcript: transcript || "",
        structured_transcript: structuredTranscript,
        symptoms: extracted_symptoms || [],
        risk_classification: finalRiskScore,
        completed_at: new Date(),
      },
    });
    
    // Invalidate the calls cache
    await redis.del("calls:all");
    await redis.del("patients:all");
  } catch (dbError) {
    console.error("Prisma DB Error:", dbError);
    throw new ApiError(500, "Failed to log call data into Database", [
      dbError.message,
    ]);
  }

  // 4. Trigger Realtime Alerts (if High or Critical)
  if (finalRiskScore === "High" || finalRiskScore === "Critical") {
    console.log(
      `🚨 ALERT! Patient ${patient_id} has a ${finalRiskScore} risk level. Dispatching SMS to Doctor.`,
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          callLog,
          appointment: proposedAppointmentData
        },
        "Webhook processed and logged successfully",
      ),
    );
});

/**
 * @desc    Twilio TwiML endpoint
 * @route   POST /api/webhooks/twilio/twiml
 */
export const handleTwilioTwiML = asyncHandler(async (req, res) => {
  const { patient_id } = req.query;
  const CallSid = req.body.CallSid || req.query.CallSid;
  console.log(
    `[Twilio Webhook] Received TwiML request for patient: ${patient_id}, CallSid: ${CallSid}`,
  );

  const twiml = new VoiceResponse();

  try {
    // Fetch patient to get diagnosis
    const patient = await prisma.patient.findUnique({
      where: { id: patient_id },
    });

    if (!patient) {
      twiml.say(
        { voice: "alice" },
        "Hello, sorry I could not find your records. Goodbye.",
      );
      res.type("text/xml");
      return res.send(twiml.toString());
    }

    // Initialize Ultravox specific to this patient
    const ultravoxData = await createUltravoxCall(
      patient.name,
      patient.primary_diagnosis,
      patient_id,
      CallSid,
      patient.flow_type || "Screening"
    );

    // Output connection Stream to Twilio format
    const connect = twiml.connect();
    connect.stream({ url: ultravoxData.joinUrl });

    console.log(`[Ultravox] Connected TwiML to: ${ultravoxData.joinUrl}`);
  } catch (e) {
    console.error("Error setting up TwiML/Ultravox:", e);
    twiml.say(
      { voice: "alice" },
      "We are experiencing technical difficulties. We will call back later.",
    );
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

/**
 * @desc    Twilio Call Status Webhook
 * @route   POST /api/webhooks/twilio/status
 */
export const handleTwilioStatus = asyncHandler(async (req, res) => {
  const { CallSid, CallStatus } = req.body;
  console.log(`[Twilio Status] Call ${CallSid} is now ${CallStatus}`);

  try {
    await prisma.callLog.updateMany({
      where: { call_id: CallSid },
      data: { status: CallStatus },
    });
    
    // Invalidate the calls cache
    await redis.del("calls:all");
    await redis.del("patients:all");
  } catch (error) {
    console.error("Failed to update call status:", error.message);
  }

  res.status(200).send("OK");
});
