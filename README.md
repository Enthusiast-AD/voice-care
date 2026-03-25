# 🎙️ Smart VoiceCare — Indic Voice AI Patient Engagement

> **"One call. One conversation. A life saved."**

<div align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge&logo=nodedotjs" />
  <img src="https://img.shields.io/badge/Database-Supabase-black?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/AI_Audio-Ultravox-orange?style=for-the-badge" />
</div>

<br/>

**Smart VoiceCare** is an AI-powered, multilingual post-discharge voice assistant. It leverages advanced Large Language Models (LLMs) and Twilio telephony to automatically contact discharged patients on basic phone calls, hold a natural conversation in their preferred local language (e.g., Hindi), detect critical symptoms in real time, score risks, and instantly alert doctors when serious medical action is required.

---

## 🚀 The Core Problem

Every year across India, millions of hospital patients are discharged with a medical summary they possibly cannot read, losing access to structured follow-up care. Preventable readmissions and unseen deteriorations cost thousands of lives and massive sums in late-stage interventions.

Current systems fail because:
- Follow-ups require smartphone apps (excluding rural/elderly patients).
- Manual call centres are not scalable for massive patient loads.
- Key medical instructions are provided in English, causing a language barrier.

## 💡 The Solution

We replace post-discharge silence with a proactive **AI voice companion that speaks the patient's language**.

- 📞 **Works on Any Phone:** No apps, no internet, no smartphones required. Only a standard telecom voice call via Twilio.
- 🗣️ **Multilingual & Colloquial:** Powered by Gemini and Ultravox AI to fluidly understand regional dialects and terminology (e.g., understanding "thoda dard hai" as mild pain and reacting accordingly).
- 🚨 **Real-Time Triaging:** Automatically classifies patients into **Low**, **Medium**, **High**, or **Critical** risk categories. Alerts doctors via dashboards and SMS triggers immediately if dangerous symptoms are flagged.
- 📊 **Doctor Dashboard:** A centralized, live-updating React front-end application tailored for hospital administrators to view patient wellbeing across the clinical landscape.

---

## 📁 Repository Structure

```
voice-care/
├── backend/                  # Node.js + Express Backend Engine
│   ├── src/
│   │   ├── controllers/      # API Logic (Patients, Webhooks, Calls, Health)
│   │   ├── routes/           # Express Route Definitions
│   │   ├── services/         # Integrations (Twilio Telephony outbound)
│   │   ├── config/           # Database Connectors (Supabase)
│   │   └── utils/            # Custom Error Handlers & API Responders
│   └── package.json
│
├── frontend/                 # React + Vite Admin Dashboard
│   ├── src/
│   │   ├── app/              # Core App Setup, Layouts & Components (shadcn/ui)
│   │   ├── pages/            # Routable views (Dashboard, Patient Detail, Alerts)
│   │   └── styles/           # Tailwind CSS theme & typography profiles
│   └── package.json
│
├── docs/                     # Comprehensive Project Documentation
│   ├── prd.md                # Detailed Product Requirements & Flow
│   ├── api.md                # Swagger-style REST API Documentation
│   └── setup.md              # Tech Architecture & Local Run Guide
│
└── README.md                 # Project Overview (You are here)
```

---

## 📖 Documentation Quick Links

For developers, product managers, and contributors, detailed implementation instructions and specs are stored in the `/docs` directory:

- [**API Documentation**](./docs/api.md) — Comprehensive guide to the backend REST endpoints and payload structures.
- [**Development Setup & Architecture**](./docs/setup.md) — How to spin up the local environment, Supabase database schema definitions, and tech stack flow.
- [**Product Requirements Document (PRD)**](./docs/prd.md) — The rationale, market analysis, and full end-to-end product logic.

---

## ⚡ Getting Started (Local Development)

This is a comprehensive monorepo consisting of discrete `frontend` and `backend` application modules. Run them concurrently for local development.

### 1. Backend API Server (Port: 5000)
Navigate to the `backend/` directory, install packages, and initialize the Express daemon:
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend React Dashboard (Port: 5173)
Open another terminal, navigate to the `frontend/` directory, install module components, and initialize Vite:
```bash
cd frontend
npm install
npm run dev
```

*(Refer to the [Setup Documentation](./docs/setup.md) for full `.env` variable initialization, primarily configuring your Supabase db keys and your Twilio SID!)*