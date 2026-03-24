import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { supabase } from "../config/supabase.js";

/**
 * @desc    Get all patients
 * @route   GET /api/patients
 * @access  Private (Mocked for now)
 */
export const getAllPatients = asyncHandler(async (req, res) => {
    // We will query the Supabase DB
    const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new ApiError(500, "Error fetching patients from Database", [error.message]);
    }

    return res.status(200).json(
        new ApiResponse(200, data || [], "Patients retrieved successfully")
    );
});

/**
 * @desc    Add a new patient
 * @route   POST /api/patients
 * @access  Private
 */
export const addPatient = asyncHandler(async (req, res) => {
    const { name, phone_number, language_preference, primary_diagnosis } = req.body;

    if (!name || !phone_number) {
        throw new ApiError(400, "Name and Phone Number are required fields");
    }

    const { data, error } = await supabase
        .from('patients')
        .insert([{ 
            name, 
            phone_number, 
            language_preference: language_preference || 'Hindi', 
            primary_diagnosis: primary_diagnosis || 'General' 
        }])
        .select()
        .single();

    if (error) {
        throw new ApiError(500, "Error inserting patient into database", [error.message]);
    }

    return res.status(201).json(
        new ApiResponse(201, data, "Patient added successfully")
    );
});
