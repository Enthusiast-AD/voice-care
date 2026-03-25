import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { makeOutboundCall } from "../services/twilio.service.js";
import { PrismaClient } from "@prisma/client";

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
  const callResult = await makeOutboundCall(patient.phone_number, patient_id);

  // 3. Log initial call state into database
  try {
    await prisma.callLog.create({
      data: {
        call_id: callResult.sid,
        patient_id: patient_id,
        status: "initiated",
        started_at: new Date(),
      },
    });
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
