import twilio from "twilio";
import "dotenv/config";
import { ApiError } from "../utils/ApiError.js";

const accountSid = process.env.TWILIO_ACCOUNT_SID || "AC_MOCK";
const authToken = process.env.TWILIO_AUTH_TOKEN || "MOCK";
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || "+1234567890";

const client = twilio(accountSid, authToken);

export const makeOutboundCall = async (toPhoneNumber, patientId, language) => {
    try {
        if (!process.env.TWILIO_ACCOUNT_SID) {
            console.warn("⚠️  WARNING: Twilio credentials missing, skipping actual call.");
            return { sid: "MOCK_CALL_SID_" + Date.now() };
        }

        const url = new URL(`${process.env.BACKEND_URL}/api/webhooks/twilio/twiml`);
        url.searchParams.append("patient_id", patientId);
        if (language) {
            url.searchParams.append("language", language);
        }

        const call = await client.calls.create({
            to: toPhoneNumber,
            from: twilioPhoneNumber,
            url: url.toString(),
            statusCallback: `${process.env.BACKEND_URL}/api/webhooks/twilio/status`,
            statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
        });

        console.log(`[Twilio] Call initiated to ${toPhoneNumber}. Call SID: ${call.sid}`);
        return call;
    } catch (error) {
        console.error("[Twilio Service Error]", error);
        throw new ApiError(500, "Failed to initiate outbound call via Twilio", [error.message]);
    }
};

export const sendSMSAlert = async (doctorPhoneNumber, patientName, riskLevel, symptoms) => {
    try {
        if (!process.env.TWILIO_ACCOUNT_SID) {
            console.warn("⚠️  WARNING: Twilio credentials missing, skipping SMS alert.");
            return { sid: "MOCK_SMS_SID_" + Date.now() };
        }

        const body = `🚨 URGENT: Patient ${patientName} flagged as ${riskLevel.toUpperCase()} risk.
Symptoms detected: ${(symptoms || []).join(", ")}.
Please check the dashboard immediately.`;
        
        const message = await client.messages.create({
            body,
            from: twilioPhoneNumber,
            to: doctorPhoneNumber
        });
        
        console.log(`[Twilio] Alert SMS sent to Doctor. SID: ${message.sid}`);
        return message;
    } catch (error) {
        console.error("[Twilio Sender Error]", error);
        throw new ApiError(500, "Failed to send SMS Alert", [error.message]);
    }
};
