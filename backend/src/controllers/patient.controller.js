import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { PrismaClient } from "@prisma/client";
import twilio from "twilio";

const prisma = new PrismaClient({});

/**
 * @desc    Get all patients
 * @route   GET /api/patients
 * @access  Private
 */
export const getAllPatients = asyncHandler(async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        call_logs: {
          orderBy: { created_at: "desc" },
          take: 1,
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, patients, "Patients retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "Error fetching patients from Database", [
      error.message,
    ]);
  }
});

/**
 * @desc    Add a new patient
 * @route   POST /api/patients
 * @access  Private
 */
export const addPatient = asyncHandler(async (req, res) => {
  const {
    name,
    phone_number,
    language_preference,
    primary_diagnosis,
    flow_type,
  } = req.body;

  if (!name || !phone_number) {
    throw new ApiError(400, "Name and Phone Number are required fields");
  }

  try {
    const patient = await prisma.patient.create({
      data: {
        name,
        phone_number,
        language_preference: language_preference || "Hindi",
        primary_diagnosis: primary_diagnosis || "General",
        flow_type: flow_type || "Screening",
      },
    });

    // Invalidate the patients cache

    return res
      .status(201)
      .json(new ApiResponse(201, patient, "Patient added successfully"));
  } catch (error) {
    throw new ApiError(500, "Error inserting patient into database", [
      error.message,
    ]);
  }
});

/**
 * @desc    Get all appointments
 * @route   GET /api/patients/appointments
 * @access  Private
 */
export const getAppointments = asyncHandler(async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          appointments,
          "Appointments retrieved successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, "Error fetching appointments from Database", [
      error.message,
    ]);
  }
});

/**
 * @desc    Approve a pending appointment and send SMS
 * @route   POST /api/patients/appointments/:appointmentId/approve
 * @access  Private
 */
export const approveAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { new_time } = req.body || {};

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true },
    });

    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    if (appointment.status === "CONFIRMED") {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            appointment,
            "Appointment is already confirmed.",
          ),
        );
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: "CONFIRMED",
        ...(new_time && { proposed_time: new Date(new_time) }),
      },
    });

    // Send SMS via Twilio using Human-in-the-Loop concept
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
      const msg = `Hello ${appointment.patient.name}, your appointment for ${appointment.patient.primary_diagnosis} has been confirmed for ${new Date(updatedAppointment.proposed_time).toLocaleString()}.`;

      try {
        await client.messages.create({
          body: msg,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: appointment.patient.phone_number,
        });
        console.log(
          `[SMS] Confirmation sent to ${appointment.patient.phone_number}`,
        );
      } catch (err) {
        console.error("[SMS] Failed to send SMS:", err.message);
      }
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedAppointment,
          "Appointment confirmed successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, "Error updating appointment", [error.message]);
  }
});

/**
 * @desc    Delete a patient
 * @route   DELETE /api/patients/:id
 * @access  Private
 */
export const deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    // Delete related records first due to foreign key constraints
    await prisma.appointment.deleteMany({
      where: { patient_id: id },
    });

    await prisma.callLog.deleteMany({
      where: { patient_id: id },
    });

    await prisma.patient.delete({
      where: { id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Patient deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Error deleting patient", [error.message]);
  }
});

/**
 * @desc    Update patient diagnosis
 * @route   PATCH /api/patients/:id/diagnosis
 * @access  Private
 */
export const updatePatientDiagnosis = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { diagnosis } = req.body;

  if (!diagnosis) {
    throw new ApiError(400, "Diagnosis is required");
  }

  try {
    const patient = await prisma.patient.update({
      where: { id },
      data: { primary_diagnosis: diagnosis },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, patient, "Diagnosis updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Error updating diagnosis", [error.message]);
  }
});

/**
 * @desc    Book a new appointment manually
 * @route   POST /api/patients/appointments
 * @access  Private
 */
export const bookAppointment = asyncHandler(async (req, res) => {
  const { patient_id, proposed_time, name, phone, type, email } = req.body;

  if (!proposed_time) {
    throw new ApiError(400, "proposed_time is required");
  }

  let finalPatientId = patient_id;

  // If coming from the public landing page form, we find or create the patient
  if (!finalPatientId && name && phone) {
    let patient = await prisma.patient.findFirst({
      where: { phone_number: phone },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name,
          phone_number: phone,
          flow_type: type || "OPD",
          primary_diagnosis: email ? `Email: ${email}` : "General",
        },
      });
    }
    finalPatientId = patient.id;
  }

  if (!finalPatientId) {
    throw new ApiError(400, "patient_id or (name and phone) is required");
  }

  const appointment = await prisma.appointment.create({
    data: {
      patient_id: finalPatientId,
      proposed_time: new Date(proposed_time),
      status: "PENDING",
    },
    include: { patient: true },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, appointment, "Appointment booked successfully"));
});
