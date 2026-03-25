# 🛠️ Smart VoiceCare Setup & Architecture

This document describes the technical architecture and local environment setup for the Smart VoiceCare project.

## Architecture Overview

Smart VoiceCare is a full-stack post-discharge patient engagement platform. It operates in two main spheres: the **Frontend Admin Dashboard** (for doctors/hospitals) and the **Backend API & Telephony Engine** (for automated AI calls).

### 🔧 Tech Stack
- **Frontend:**
  - **Framework:** React + Vite + TypeScript
  - **Styling:** Tailwind CSS + custom UI components (`shadcn/ui`, Radix UI)
  - **Icons:** Lucide React, MUI Icons
  - **Routing:** React Router DOM (via Vite configurations)
- **Backend:**
  - **Runtime:** Node.js
  - **Framework:** Express.js
  - **Database:** Supabase (PostgreSQL)
  - **Telephony & AI:** Twilio Programmable Voice + Ultravox (Multimodal AI)

### 🧩 Core Components Flow
1. **Twilio Service:** Handles the outbound PSTN calls to the patients using standard cellular networks.
2. **Ultravox AI:** Acts as the voice brain, understanding Indic languages natively, conversing accurately, extracting symptoms, and deriving a prioritized "Risk Score" using LLM logic.
3. **Node.js Webhooks:** Receives end-of-call context payloads from Ultravox, stores the transcript in Supabase, and flags high-risk patients.
4. **React Dashboard:** A centralized portal for doctors/hospital administrators to view scheduled actions, real-time alerts, detailed call logs, and patient records.

---

## Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- Active Supabase Project
- Twilio Account (with a verified sender number)
- Ultravox Account/API Key

### 2. Environment Variables (`backend/.env`)
Create a `.env` file in the `backend/` directory with the following shape:
```env
# Server
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
```

### 3. Backend Setup
1. Open your terminal and change directory to the backend folder:
   ```bash
   cd backend
   npm install
   ```
2. Start the development server (runs via `nodemon` for auto-reloading):
   ```bash
   npm run dev
   ```
3. The server should be running concurrently at `http://localhost:5000`.

### 4. Frontend Setup
1. Open another terminal session and change directory to the frontend folder:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. The application interface will be accessible interactively at the local URL provided by Vite (typically `http://localhost:5173`).

---

## Database Schema Model (Supabase)
Ensure the following tables exist within your Supabase SQL instance to match the controller validations:

- **`patients`**: Tracks discharged patients context.
  - `id` (UUID, Primary Key)
  - `name` (String)
  - `phone_number` (String)
  - `language_preference` (String)
  - `primary_diagnosis` (String)
  - `created_at` (Timestamp)

- **`call_logs`**: Tracks live AI call statuses, history, and analytics.
  - `id` (UUID, Primary Key)
  - `call_id` (String - Matches Twilio Call SID)
  - `patient_id` (UUID - Foreign Key relational to patients table)
  - `status` (String - Enum representation like 'initiated', 'completed')
  - `transcript` (Text)
  - `symptoms` (JSONB / Array representation of inferred symptoms)
  - `risk_classification` (String - Low/Medium/High/Critical)
  - `started_at` (Timestamp)
  - `completed_at` (Timestamp)