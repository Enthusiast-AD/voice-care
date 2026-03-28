import axios from "axios";
import "dotenv/config";

const getDynamicPrompt = (patientName, primaryDiagnosis, flowType) => {
  const basePrompt = `You are a medical AI assistant for VoiceCare. 
You are speaking to ${patientName}. The primary diagnosis or problem is: ${primaryDiagnosis}.
CRITICAL BEHAVIOR RULES:
- KEEP YOUR RESPONSES EXTREMELY SHORT, MAXIMUM 1 OR 2 SENTENCES.
- DO NOT RAMBLE. DO NOT OFFER MEDICAL EXPLANATIONS.
- ASK ONLY ONE QUESTION AT A TIME.
- FOCUS DIRECTLY ON ${primaryDiagnosis} AND NOTHING ELSE.`;

  if (flowType === "Screening") {
    return `${basePrompt}
Your role is triage. Briefly ask about current symptoms related to ${primaryDiagnosis}. 
Evaluate the severity and suggest OPD visit if needed. Be incredibly concise.`;
  }
  
  if (flowType === "OPD to IPD") {
    return `${basePrompt}
Explain admission details very briefly. Remind about insurance and fasting for ${primaryDiagnosis}. Ask if they understood.`;
  }
  
  if (flowType === "Follow-up") {
    return `${basePrompt}
Track post-discharge recovery for ${primaryDiagnosis}. 
Ask ONE short question about swelling or pain. Then ask if they took medications.`;
  }

  if (flowType === "Vaccination") {
    return `${basePrompt}
Remind about the newborn vaccination (${primaryDiagnosis}). Ask a single short question if they are coming to the clinic.`;
  }

  // Backup generic prompt
  return `${basePrompt}
Ask 2-3 simple questions (one by one) to check their current symptoms, wait for their answer, and then politely end the call.`;
};

export const createUltravoxCall = async (
  patientName,
  primaryDiagnosis,
  patientId,
  callId,
  flowType = "Screening"
) => {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://your-domain.ngrok-free.app";

    const systemPromptGenerated = getDynamicPrompt(patientName, primaryDiagnosis, flowType) + `
    
Tell them if they have any severe symptoms like chest pain or difficulty breathing, they should hang up and call an ambulance immediately.

CRITICAL INSTRUCTION: When the conversation is over, or if you need to end the call, you MUST do these TWO actions in order:
1) FIRST, call the "saveCallData" tool to save the transcript, the symptoms the patient mentioned, and a risk score (Low, Medium, High, or Critical). The call_id is "${callId}" and patient_id is "${patientId}".
2) SECOND, call the "hangUp" tool to disconnect the call. Do not forget to call "hangUp".`;

    const response = await axios.post(
      "https://api.ultravox.ai/api/calls",
      {
        systemPrompt: systemPromptGenerated,
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
                },
                {
                  name: "requested_appointment_time",
                  location: "PARAMETER_LOCATION_BODY",
                  schema: { type: "string" },
                  required: false
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
