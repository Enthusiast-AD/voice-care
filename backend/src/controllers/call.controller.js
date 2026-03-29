import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { makeOutboundCall } from "../services/twilio.service.js";
import { PrismaClient } from "@prisma/client";
import redis from "../config/redis.js";

const prisma = new PrismaClient();

/**
 * @desc    Triggers an outbound voice call to a specific patient
 * @route   POST /api/calls/trigger
 * @access  Private (Dashboard)
 */
export const triggerPatientCall = asyncHandler(async (req, res) => {
  const { patient_id } = req.body;

  if (!patient_id) {
    throw new ApiError(400, "patient_id is required to trigger a call");
  }

  // 1. Fetch patient details
  const patient = await prisma.patient.findUnique({
    where: { id: patient_id },
  });

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  if (!patient.phone_number) {
    throw new ApiError(400, "Patient does not have a registered phone number");
  }

  // 2. Trigger Twilio Call
  let callResult;
  try {
     callResult = await makeOutboundCall(patient.phone_number, patient_id);
  } catch (twilioErr) {
     throw new ApiError(500, "Failed to connect to Twilio to make outbound call", [twilioErr.message]);
  }

  // 3. Log initial call state into database
  try {
    const callLog = await prisma.callLog.create({
      data: {
        call_id: callResult.sid,
        patient_id: patient_id,
        status: "initiated",
        started_at: new Date(),
      },
    });
    
    // Invalidate the calls cache
    await redis.del("calls:all");
    await redis.del("patients:all");
  } catch (dbError) {
    console.error("Failed to insert call log natively", dbError);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { sid: callResult.sid, status: "initiated" },
        "Call triggered successfully",
      ),
    );
});

/**
 * @desc    Fetch all call logs
 * @route   GET /api/calls
 * @access  Private (Dashboard)
 */
export const getAllCalls = asyncHandler(async (req, res) => {
  try {
    const cachedCalls = await redis.get("calls:all");
    if (cachedCalls) {
      return res
        .status(200)
        .json(new ApiResponse(200, JSON.parse(cachedCalls), "Call logs retrieved successfully from cache"));
    }

    const calls = await prisma.callLog.findMany({
      include: {
        patient: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    await redis.set("calls:all", JSON.stringify(calls), "EX", 300); // Cache for 5 minutes

    return res
      .status(200)
      .json(new ApiResponse(200, calls, "Call logs retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "Error fetching calls from database", [error.message]);
  }
});
