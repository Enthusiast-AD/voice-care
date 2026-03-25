import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

/**
 * @desc    Get all patients
 * @route   GET /api/patients
 * @access  Private (Mocked for now)
 */
export const getAllPatients = asyncHandler(async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
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
  const { name, phone_number, language_preference, primary_diagnosis } =
    req.body;

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
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, patient, "Patient added successfully"));
  } catch (error) {
    throw new ApiError(500, "Error inserting patient into database", [
      error.message,
    ]);
  }
});
