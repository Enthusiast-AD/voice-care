import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @desc    Receive webhook from Ultravox when an AI call finishes
 * @route   POST /api/webhooks/ultravox
 * @access  Public (Should verify signature in prod)
 */
export const handleUltravoxWebhook = asyncHandler(async (req, res) => {
  // 1. Extract call details from Ultravox payload
  // Note: The specific payload shape will depend on how you configure Ultravox.
  // For now, tracking to PRD structure: transcript, symptoms, risk score.
  const { call_id, patient_id, transcript, extracted_symptoms, risk_score } =
    req.body;

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
  // Usually Low/Medium/High/Critical as per PRD
  const finalRiskScore = risk_score || "Low";

  // 3. Save to Database (Call Logs table)
  let callLog;
  try {
    callLog = await prisma.callLog.upsert({
      where: { call_id },
      update: {
        transcript: transcript || "",
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
        symptoms: extracted_symptoms || [],
        risk_classification: finalRiskScore,
        completed_at: new Date(),
      },
    });
  } catch (dbError) {
    console.error("Prisma DB Error:", dbError);
    throw new ApiError(500, "Failed to log call data into Database", [
      dbError.message,
    ]);
  }

  // 4. Trigger Realtime Alerts (if High or Critical)
  // If the risk is High/Critical, in the future this will trigger Socket.io
  // AND a Twilio SMS to the doctor.
  if (finalRiskScore === "High" || finalRiskScore === "Critical") {
    console.log(
      `🚨 ALERT! Patient ${patient_id} has a ${finalRiskScore} risk level. Dispatching SMS to Doctor.`,
    );
    // Placeholder for Twilio SMS Integration
    // await triggerDoctorSMSAlert(patient_id, finalRiskScore, extracted_symptoms);
  }

  // 5. Respond to Ultravox ensuring receipt
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        callLog,
        "Webhook processed and logged successfully",
      ),
    );
});
