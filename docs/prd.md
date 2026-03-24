# 📋 Product Requirements Document
## Smart Post-Discharge Voice Care Assistant
### *Smart VoiceCare — Indic Voice AI Patient Engagement*

---

> **"One call. One conversation. A life saved."**

---

## 1. Executive Summary

India discharges tens of millions of inpatients every year — and the moment a patient steps out of the hospital gate, structured medical support largely vanishes. The **Smart Post-Discharge Voice Care Assistant** is an AI-powered, multilingual voice system that automatically calls discharged patients, holds a natural conversation in their preferred language, detects warning symptoms, scores risk in real time, and instantly alerts doctors when action is needed.

| Attribute | Value |
|-----------|-------|
| **Product Name** | Smart VoiceCare |
| **Theme** | Indic Voice AI Patient Engagement |
| **Primary Market** | India (Tier 1–3 cities + rural) |
| **Target Users** | Discharged patients, doctors, hospital admins |
| **Core Channel** | Outbound voice call (works on any basic phone) |

---

## 2. Problem Statement

### 2.1 The Silent Crisis After Discharge

Every year, crores of patients are discharged from Indian hospitals — from AIIMS Delhi to small private clinics in rural Bihar. The moment they leave, structured medical support vanishes. They receive a discharge summary (often in English they cannot read), a list of medicines, and a follow-up date weeks away.

**Real Impact:**
- **15–25%** of cardiac and surgical patients experience avoidable post-discharge complications
- Preventable readmissions cost patients **₹15,000–₹1,00,000+** per event
- India has **1 doctor per 1,445 people** vs WHO-recommended 1 per 1,000
- Over **300 million** hospital outpatient visits annually

### 2.2 Why Current Systems Fail

| Problem | Impact |
|---------|--------|
| No structured follow-up mechanism | Patients deteriorate undetected |
| Discharge summaries in English | Critical instructions lost for non-English speakers |
| Doctor overload | Doctors cannot monitor every discharged patient |
| Health apps require smartphones | Rural and elderly patients excluded |
| Patients don't recognise dangerous symptoms | Delayed action, preventable deaths |

---

## 3. Proposed Solution

**Replace post-discharge silence with a proactive, intelligent, voice-based companion that speaks the patient's language — literally.**

The solution leverages **Ultravox**, a cutting-edge multimodal AI voice platform, to handle end-to-end voice interaction (speech recognition, LLM conversation, and text-to-speech) integrated seamlessly with **Node.js** backend and **Twilio** telephony. This ensures:

- ✅ No app required
- ✅ No internet required
- ✅ No literacy required
- ✅ Works on any basic phone or landline
- ✅ Real-time voice conversation powered by advanced AI (Gemini)
- ✅ Instant risk detection and escalation

### 3.1 Core Capabilities

| Capability | Description |
|-----------|-------------|
| 📞 **Automated Voice Calls** | Scheduled follow-up calls on Day 1, 3, 7, 14 post-discharge via Twilio |
| 🗣️ **Multilingual Voice Conversation** | Ultravox handles speech recognition and response generation in Hindi and 10+ Indian regional languages |
| 🧠 **AI-Powered Symptom Detection** | Gemini LLM understands colloquial speech during natural conversation — "thoda dard hai" → mild pain with context |
| 📊 **Real-Time Risk Scoring** | Gemini-based classification into Low / Medium / High / Critical categories during call flow |
| 🚨 **Instant Doctor Alerts** | SMS, WhatsApp, push notification on High/Critical detection via multi-channel notification system |
| 🖥️ **Doctor Dashboard** | Centralised real-time view of all discharged patients ranked by risk, powered by Socket.IO live updates |

---

## 4. End-to-End User Flow

```
Patient Discharge
      │
      ▼
Registration & Schedule Generation (Day 1, 3, 7, 14)
      │
      ▼
Node.js Triggers Outbound Call (Twilio)
      │
      ▼
Twilio ↔ Ultravox Voice AI Bridge
      │
      ├── Patient Speech → Ultravox STT
      ├── Gemini LLM Conversation & Risk Scoring
      ├── LLM Response → Ultravox TTS
      └── Audio Playing to Patient
      │
      ▼
Call Completes → Ultravox Sends Webhook to Node.js
      │
      ├── Call transcript
      ├── Extracted symptoms
      ├── Risk score & classification
      └── Conversation summary
      │
      ▼
Post-Call Risk Classification
      │
      ├── 🟢 Low     → Log & schedule next call
      ├── 🟡 Medium  → Log & flag for review
      ├── 🟠 High    → Alert doctor (SMS + WhatsApp + Dashboard)
      └── 🔴 Critical → Immediate multi-channel alert + escalation
      │
      ▼
Doctor Dashboard (React.js — real-time via Socket.IO)
└─ Patient list, risk levels, transcripts, call outcomes
```

---

## 5. Conversation State Machine

The AI conversation follows a structured state machine ensuring clinical completeness while feeling natural:

| State | Description |
|-------|-------------|
| `GREETING` | Confirms patient identity and language preference |
| `GENERAL_WELLBEING` | Open question: "How are you feeling overall today?" |
| `CONDITION_SPECIFIC_CHECK` | Targeted questions by diagnosis (cardiac, diabetic, surgical, orthopaedic) |
| `MEDICATION_CHECK` | Confirms medication adherence |
| `DIET_MOBILITY` | Dietary compliance and mobility level |
| `ESCALATION` *(conditional)* | Triggered if High/Critical symptom detected at any stage |
| `CLOSING` | Reassurance, next call reminder, emergency contact number |

> **Design Principle:** Gemini LLM via Ultravox enforces clinical completeness while maintaining conversational naturalness. The system can ask follow-ups, revisit topics, or skip ahead based on patient responses, all within a single voice interaction.

---

## 6. Technology Stack

### 6.1 Frontend — Doctor Dashboard & Admin Panel

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React.js** | v18+ | Component-based UI for doctor dashboard and admin portal |
| **TypeScript** | v5+ | Type-safe frontend development; reduces runtime bugs |
| **Tailwind CSS** | v3 | Rapid, consistent UI styling |
| **React Query (TanStack)** | v5 | Server-state management; auto-refetch for live dashboard |
| **Recharts** | v2 | Real-time risk score graphs, trend charts, call history timelines |
| **Socket.IO (client)** | v4 | Live WebSocket connection for real-time alert notifications |
| **React Router** | v6 | Navigation between patient list, detail views, settings |
| **Axios** | v1 | HTTP client for API calls to backend |
| **i18next** | v23 | UI internationalisation for Hindi and English dashboard views |

---

### 6.2 Backend — Core Application Server

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 20 LTS | Primary backend runtime — lightweight, event-driven, built for I/O |
| **Express.js** or **Fastify** | v4 (Express) / v4.25+ (Fastify) | High-performance REST API framework for handling webhook events and API requests |
| **Supabase Client** | v2+ | Unified SDK for database access, auth management, and real-time subscriptions |
| **Socket.IO (server)** | v4+ | WebSocket server for ultra-low latency alerts (optional, can be partially replaced by Supabase Realtime) |
| **Bull** | v4+ | Redis-backed job queue for scheduling follow-up calls and batch notifications |
| **Node-schedule** | v2+ | Cron-based job scheduling for call triggers and cleanup tasks |
| **Dotenv** | latest | Environment variable management for API keys and secrets |
| **Joi** | v17+ | Data validation and schema definition for API requests |
| **Axios** or **node-fetch** | latest | HTTP client for Twilio, Ultravox, and third-party API calls |

---

### 6.3 Database & Infrastructure Layer (Supabase)

| Technology | Role | What is Stored / Managed |
|-----------|------|--------------------------|
| **PostgreSQL 16** | Primary Database | Managed by Supabase. Stores patient records, call logs, risk scores, doctor profiles. |
| **Supabase Auth** | Authentication | Handles doctor logins, JWT generation, password recovery, and role-based access control (RBAC). |
| **Supabase Realtime** | Event Subscription | Listens to database changes (e.g., `INSERT risk_score`) to instantly update the frontend dashboard. |
| **Supabase Storage** | File Storage | S3-compatible storage for call audio recordings and generated PDF reports. |
| **Redis** | Job Queue Store | (Managed externally or via Upstash) Backend store for Bull queue to manage call scheduling. |

---

### 6.4 Telephony Layer

| Service | Provider | Role |
|---------|---------|------|
| **Outbound Call Engine** | **Twilio (Primary)** | Places automated outbound calls to patients across India with built-in Ultravox integration |
| **Call Flow Management** | Twilio Studio | Programmatic flow control for voice call sequences and data collection |
| **Webhook Events** | Node.js endpoint | Receives call connected, speech input transcription, call ended, and Ultravox completion events |
| **Call Recording** | Twilio built-in | Optional encrypted recording for quality assurance and compliance |
| **SMS Alerts** | Twilio SMS / MSG91 | Alert SMS to doctors; call summaries to patients/caregivers |

> **Why Twilio + Ultravox Integration?** Twilio provides reliable India-wide calling infrastructure with high compliance standards. Ultravox's deep integration with Twilio allows voice sessions to be routed directly to Ultravox's AI engine, eliminating intermediaries and ensuring sub-100ms latency for natural conversations.

---

### 6.5 Speech AI & Voice Conversation Engine

| Service | Provider | Role |
|---------|---------|------|
| **Voice AI Engine** | **Ultravox** | End-to-end voice conversation platform — handles speech recognition, LLM processing, and speech synthesis in a single integrated system |
| **STT (Speech-to-Text)** | Ultravox (built-in) | Real-time transcription of patient speech in Hindi and 10+ Indian languages |
| **TTS (Text-to-Speech)** | Ultravox (built-in) | Natural-sounding voice responses in patient's language — no separate TTS required |
