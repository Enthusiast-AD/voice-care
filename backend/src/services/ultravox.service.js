import axios from "axios";
import "dotenv/config";
import { getDynamicPrompt, FLOW_TYPES } from "./prompts.js";

const getBackendUrl = () => {
  const url = process.env.BACKEND_URL;
  if (!url) throw new Error("BACKEND_URL is not set in environment variables.");
  return url;
};

const validatePatient = (patient) => {
  const required = ["name", "diagnosis", "id"];
  for (const field of required) {
    if (!patient[field]) throw new Error(`Missing required patient field: "${field}"`);
  }
};

const buildTools = (callId, patientId, backendUrl) => [
  { toolName: "hangUp" },
  {
    temporaryTool: {
      modelToolName: "saveCallData",
      description: `Save transcript, symptoms, and risk score at the end of the call.
                    call_id is "${callId}", patient_id is "${patientId}".
                    Call this ONCE before hanging up. Never skip it.`,
      dynamicParameters: [
        {
          name: "call_id",
          location: "PARAMETER_LOCATION_BODY",
          schema: { type: "string" },
          required: true,
        },
        {
          name: "patient_id",
          location: "PARAMETER_LOCATION_BODY",
          schema: { type: "string" },
          required: true,
        },
        {
          name: "transcript",
          location: "PARAMETER_LOCATION_BODY",
          schema: { type: "string" },
          required: true,
        },
        {
          name: "extracted_symptoms",
          location: "PARAMETER_LOCATION_BODY",
          schema: { type: "array", items: { type: "string" } },
          required: true,
        },
        {
          name: "risk_score",
          location: "PARAMETER_LOCATION_BODY",
          schema: {
            type: "string",
            enum: ["Low", "Medium", "High", "Critical"],
          },
          required: true,
        },
        {
          name: "requested_appointment_time",
          location: "PARAMETER_LOCATION_BODY",
          schema: { type: "string" },
          required: false,
        },
        {
          name: "follow_up_needed",
          location: "PARAMETER_LOCATION_BODY",
          schema: { type: "boolean" },
          required: false,
        },
        {
          name: "call_summary",
          location: "PARAMETER_LOCATION_BODY",
          schema: { type: "string" },
          required: false,
        },
      ],
      http: {
        baseUrlPattern: `${backendUrl}/api/webhooks/ultravox`,
        httpMethod: "POST",
      },
    },
  },
];

export const createUltravoxCall = async (
  patient,
  callId,
  flowType = FLOW_TYPES.SCREENING
) => {
  validatePatient(patient);
  const backendUrl = getBackendUrl();
  const systemPrompt = getDynamicPrompt(patient, flowType);

  try {
    const response = await axios.post(
      "https://api.ultravox.ai/api/calls",
      {
        systemPrompt,
        temperature: parseFloat(process.env.ULTRAVOX_TEMPERATURE || "0.3"),
        model: process.env.ULTRAVOX_MODEL || "ultravox-v0.7",
        medium: { twilio: {} },
        selectedTools: buildTools(callId, patient.id, backendUrl),
      },
      {
        headers: {
          "X-API-Key": process.env.ULTRAVOX_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to initialize Ultravox AI call", { cause: error });
  }
};
