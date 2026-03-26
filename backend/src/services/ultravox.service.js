import axios from "axios";
import "dotenv/config";

export const createUltravoxCall = async (
  patientName,
  primaryDiagnosis,
  patientId,
  callId
) => {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://your-domain.ngrok-free.app";

    const response = await axios.post(
      "https://api.ultravox.ai/api/calls",
      {
        systemPrompt: `You are a medical AI assistant for VoiceCare.
            You are calling a patient named ${patientName}.
            Their primary diagnosis or concern is: ${primaryDiagnosis}.

            Your job is to politely ask them specific questions related ONLY to ${primaryDiagnosis}.
            Do NOT answer irrelevant questions. Do NOT hallucinate medical advice. Ask 3-4 simple questions to check their current symptoms, wait for their answer, and then politely end the call.

            Tell them if they have any severe symptoms like chest pain or difficulty breathing, they should hang up and call an ambulance immediately.

            CRITICAL INSTRUCTION: When the conversation is over, or if you need to end the call, you MUST do these TWO actions in order:
            1) FIRST, call the "saveCallData" tool to save the transcript, the symptoms the patient mentioned, and a risk score (Low, Medium, High, or Critical). The call_id is "${callId}" and patient_id is "${patientId}".
            2) SECOND, call the "hangUp" tool to disconnect the call. Do not forget to call "hangUp".`,
        temperature: 0.3,
        model: "ultravox-v0.7",
        medium: { twilio: {} },
        selectedTools: [
          { toolName: "hangUp" },
          {
            temporaryTool: {
              modelToolName: "saveCallData",
              description: "Send the final transcribed data, symptoms, and risk score to the database. Use this exactly once at the end of the call, right before hanging up.",
              dynamicParameters: [
                {
                  name: "call_id",
                  location: "PARAMETER_LOCATION_BODY",
                  schema: { type: "string" },
                  required: true
                },
                {
                  name: "patient_id",
                  location: "PARAMETER_LOCATION_BODY",
                  schema: { type: "string" },
                  required: true
                },
                {
                  name: "transcript",
                  location: "PARAMETER_LOCATION_BODY",
                  schema: { type: "string" },
                  required: true
                },
                {
                  name: "extracted_symptoms",
                  location: "PARAMETER_LOCATION_BODY",
                  schema: { type: "array", items: { type: "string" } },
                  required: true
                },
                {
                  name: "risk_score",
                  location: "PARAMETER_LOCATION_BODY",
                  schema: { type: "string", enum: ["Low", "Medium", "High", "Critical"] },
                  required: true
                }
              ],
              http: {
                baseUrlPattern: `${backendUrl}/api/webhooks/ultravox`,
                httpMethod: "POST"
              }
            }
          }
        ]
      },
      {
        headers: {
          "X-API-Key": process.env.ULTRAVOX_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Ultravox API Error:", error.response?.data || error.message);
    throw new Error("Failed to initialize Ultravox AI call");
  }
};
