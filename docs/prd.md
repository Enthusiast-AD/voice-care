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

- ✅ No app required
- ✅ No internet required
- ✅ No literacy required
- ✅ Works on any basic phone or landline

### 3.1 Core Capabilities

| Capability | Description |
|-----------|-------------|
| 📞 **Automated Voice Calls** | Scheduled follow-up calls on Day 1, 3, 7, 14 post-discharge |
| 🗣️ **Multilingual Dialogue** | Hindi, English + 10+ Indian regional languages via Bhashini |
| 🧠 **AI Symptom Extraction** | Understands colloquial speech — "thoda dard hai" → mild pain |
| 📊 **Real-Time Risk Scoring** | Low / Medium / High / Critical classification per call |
| 🚨 **Instant Doctor Alerts** | SMS, WhatsApp, push notification on High/Critical detection |
| 🖥️ **Doctor Dashboard** | Centralised view of all discharged patients ranked by risk |

---

## 4. End-to-End User Flow

```
Patient Discharge
      │
      ▼
Registration & Schedule Generation (Day 1, 3, 7, 14)
      │
      ▼
Automated Outbound Call (Exotel → Patient's Phone)
      │
      ▼
AI Conversation in Patient's Language (LangChain + GPT-4o)
      │
      ├── Speech → Bhashini STT → Text
      ├── Symptom Extraction (IndicBERT NER)
      ├── Risk Scoring (XGBoost Classifier)
      └── Response Generation → Bhashini TTS → Audio
      │
      ▼
Post-Call Risk Classification
      │
      ├── 🟢 Low     → Log & schedule next call
      ├── 🟡 Medium  → Log & flag for review
      ├── 🟠 High    → Alert doctor (SMS + WhatsApp + Dashboard)
      └── 🔴 Critical → Immediate multi-channel alert
      │
      ▼
Doctor Dashboard (React.js — real-time via Socket.IO)
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

> **Design Principle:** The state machine enforces clinical completeness; the LLM handles conversational naturalness. The LLM can ask follow-ups, revisit topics, or skip ahead based on patient responses.

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
| **Python** | 3.11+ | Primary backend language — strong AI/ML ecosystem |
| **FastAPI** | v0.110+ | High-performance async REST API framework |
| **Uvicorn** | ASGI | Production-grade ASGI server for FastAPI |
| **Celery** | v5 | Distributed task queue — manages scheduled call jobs |
| **Redis** | v7 | Message broker for Celery; session caching and rate limiting |
| **Socket.IO (server)** | v5 (Python) | WebSocket server for real-time alerts to dashboard |
| **APScheduler** | v3 | Cron-based scheduler for triggering follow-up call jobs |
| **Pydantic** | v2 | Data validation and serialisation for API models |
| **SQLAlchemy** | v2 (async) | Async ORM for database interactions at scale |
| **Alembic** | latest | Database migration management |
| **JWT (python-jose)** | latest | Secure authentication tokens for hospital staff |
| **Bcrypt** | latest | Password hashing for all user accounts |

---

### 6.3 Database Layer

| Database | Type | What is Stored |
|---------|------|----------------|
| **PostgreSQL 16** | Primary RDBMS | Patient records, discharge data, call logs, symptom extractions, risk scores, doctor profiles, alert history |
| **Redis 7** | In-memory cache | Active call sessions, real-time risk flags, Celery job queue, temporary conversation state |
| **AWS S3 / MinIO** | Object storage | Call audio recordings, conversation transcripts (encrypted at rest) |

---

### 6.4 Telephony Layer

| Service | Provider | Role |
|---------|---------|------|
| **Outbound Call Engine** | Exotel (Primary) / Twilio (Fallback) | Places automated outbound calls to patients across India |
| **IVR / Call Flow** | Exotel Exoflow / Twilio Studio | Visual call flow builder — controls audio prompt sequences |
| **DTMF Input Handling** | Exotel / Twilio | Fallback input — patients press 1/2/3 if voice recognition fails |
| **Webhook Events** | FastAPI endpoint | Receives call start, speech input, and call-end events |
| **Call Recording** | Exotel built-in | Optional encrypted recording for quality assurance |
| **SMS Alerts** | Twilio SMS / MSG91 | Alert SMS to doctors; call summaries to patients/caregivers |

> **Why Exotel?** India's leading cloud telephony platform used by Practo and PharmEasy. Supports Indian mobile numbers natively, has local data residency compliance, and is significantly cheaper than Twilio for Indian call volumes.

---

### 6.5 Speech AI Layer

| Service | Provider | Role |
|---------|---------|------|
| **Speech-to-Text (Primary)** | **Bhashini** | Transcribes patient speech in Hindi and 21 other Indian languages in real time |
| **Speech-to-Text (Fallback)** | Google Cloud Speech-to-Text | Fallback STT when Bhashini confidence < 0.75 |
| **Text-to-Speech (Primary)** | **Bhashini TTS** | Converts AI response text to natural-sounding Indian language speech |
| **TTS (Fallback)** | Google Cloud TTS / Azure TTS | Neural TTS fallback with WaveNet voices for Hindi, Tamil, Bengali, Telugu |
| **Language Detection** | Bhashini / langdetect | Auto-detects patient's spoken language if preference not pre-set |
| **Translation** | Bhashini NMT | Translates symptom data and summaries between Indian languages |

> **Bhashini Advantage:** India's government-funded national AI language mission. APIs are **free for Indian healthcare deployments**, support 22 scheduled languages, and comply with Indian data localisation laws — ideal for government hospital rollouts.

---

### 6.6 AI / LLM Engine

| Component | Technology | Function |
|-----------|-----------|---------|
| **Conversation Manager** | GPT-4o / Claude 3.5 Sonnet (via API) | Generates dynamic, contextual follow-up questions |
| **Symptom Extractor** | Fine-tuned LLM + spaCy NER | Extracts clinical symptoms from colloquial Indic speech |
| **Intent Classifier** | Fine-tuned BERT / IndicBERT | Classifies patient response intent (symptom report / question / OK) |
| **Risk Scoring Model** | Rule-based + XGBoost classifier | Combines symptom severity, patient history, call day → risk probability |
| **Conversation Memory** | LangChain ConversationBufferMemory | Maintains context across multi-turn dialogue within a call |
| **Prompt Templates** | LangChain PromptTemplate | Condition-specific templates (cardiac, diabetic, surgical, orthopaedic) |
| **LLM Orchestration** | LangChain / LlamaIndex | Chains STT → symptom extraction → response generation → TTS |
| **Embeddings / RAG** | OpenAI Embeddings + FAISS | Retrieval-Augmented Generation from clinical knowledge base |

**Risk Classification Thresholds:**

| Score | Level | Action |
|-------|-------|--------|
| 0.0 – 0.35 | 🟢 **Low** | Log and schedule next call |
| 0.35 – 0.60 | 🟡 **Medium** | Flag for optional review |
| 0.60 – 0.85 | 🟠 **High** | Instant multi-channel doctor alert |
| 0.85 – 1.0 | 🔴 **Critical** | Immediate emergency alert + escalation |

---

### 6.7 Notification & Alerting

| Channel | Technology | Trigger |
|---------|-----------|---------|
| **In-app alert** | Socket.IO real-time push | Instant dashboard notification on High/Critical risk |
| **WhatsApp message** | WhatsApp Business API (Meta) | Structured alert with patient name, risk level, top symptoms |
| **SMS** | Twilio SMS / MSG91 | Backup alert for doctors not on the app |
| **Email digest** | SendGrid / AWS SES | Daily summary email to hospital admin |
| **Push notification** | Firebase Cloud Messaging (FCM) | Mobile push to doctor's phone via companion app |

---

### 6.8 Infrastructure & DevOps

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Cloud Provider** | AWS (Primary) / Azure (Alt) | Compute, storage — both have Indian region data centres |
| **Containerisation** | Docker + Docker Compose | Packages all microservices consistently |
| **Orchestration** | Kubernetes (EKS) | Auto-scales call processing workers during peak hours |
| **API Gateway** | AWS API Gateway / Nginx | Routes and rate-limits all incoming API requests |
| **CI/CD Pipeline** | GitHub Actions | Automated testing, linting, and deployment on every code push |
| **Secrets Management** | AWS Secrets Manager | Securely stores API keys (Bhashini, Exotel, OpenAI, Twilio) |
| **Monitoring** | Prometheus + Grafana | Real-time monitoring of call success rates, API latency |
| **Error Tracking** | Sentry | Automatic error capture across backend and frontend |
| **Logging** | ELK Stack (ElasticSearch) | Centralised structured logs for all call events and errors |
| **Data Backup** | AWS RDS automated backups | Daily encrypted snapshots; 30-day retention |

---

### 6.9 Security & Compliance

| Concern | Measure |
|---------|---------|
| **Data Encryption in Transit** | TLS 1.3 on all API endpoints and WebSocket connections |
| **Data Encryption at Rest** | AES-256 encryption for all DB records and S3 call recordings |
| **Authentication** | JWT-based auth with RBAC — separate roles for doctor, nurse, admin |
| **Patient Data Privacy** | DISHA (Digital Information Security in Healthcare Act) compliant |
| **API Key Security** | All third-party API keys in AWS Secrets Manager — never in code |
| **Audit Logging** | Every data access and modification logged with timestamp and user |
| **Call Recording Consent** | Automated verbal consent prompt at call start; response logged |
| **Data Localisation** | All patient data stored in AWS Mumbai region (ap-south-1) |

---

## 7. Data Model — Core Tables

| Table | Key Columns | Description |
|-------|-------------|-------------|
| `patients` | id, name, phone, language, diagnosis_code, discharge_date, assigned_doctor_id | Master patient record at discharge |
| `call_schedules` | id, patient_id, scheduled_at, status, celery_task_id | Auto-generated call schedule per patient |
| `call_sessions` | id, patient_id, call_sid, start_time, end_time, duration, transcript_url | One record per completed call |
| `symptom_logs` | id, call_session_id, symptom_code, severity, confidence, extracted_text | Structured symptoms per call |
| `risk_scores` | id, call_session_id, patient_id, score, level, model_version, scored_at | Risk classification result per call |
| `alerts` | id, patient_id, risk_level, triggered_at, channels_sent, acknowledged_by | Alert dispatch record for audit trail |
| `doctors` | id, name, email, phone, specialty, hospital_id, notification_prefs | Doctor profile and notification preferences |
| `hospitals` | id, name, city, state, hms_integration_key, bhashini_key | Hospital onboarding and API key management |

---

## 8. Scalability Design

| Concern | Solution |
|---------|---------|
| **Horizontal scaling** | Celery workers containerised, scaled via Kubernetes HPA on queue depth |
| **Peak load (10,000 simultaneous calls)** | 50+ Celery workers + Exotel 99.9% uptime SLA |
| **Database read scaling** | PostgreSQL read replicas for dashboard; primary for call writes only |
| **Frontend performance** | Static assets via AWS CloudFront — sub-100ms load globally |
| **Rate limiting** | Redis-backed rate limiter on all API endpoints |

---

## 9. Key Features Summary

| Feature | What It Does | Benefit |
|---------|-------------|---------|
| 🎙️ **Intelligent Voice Interaction** | Natural, adaptive conversations in patient's language | Feels human; patients respond honestly |
| 🌐 **Multilingual Support** | Hindi, English + 10+ Indian languages via Bhashini | Reaches every patient, including rural |
| 📈 **Symptom Trend Tracking** | Logs symptoms per call; tracks across all follow-ups | Catches slow-developing complications |
| 🤖 **AI Risk Scoring** | Classifies Low / Medium / High / Critical after every call | Doctors focus only on who truly needs them |
| 🚨 **Real-Time Alerts** | Instant SMS / WhatsApp / push on High/Critical risk | Zero delay in emergency response |
| 🖥️ **Doctor Dashboard** | Patient list, risk levels, transcripts, trends | Full monitoring without extra calls |
| 📅 **Scheduled Call Automation** | Auto-generates follow-up schedule from diagnosis | No manual work for hospital staff |
| 📱 **No App Required** | Works on any basic mobile or landline | Maximum accessibility across India |

---

## 10. Deployment Roadmap

### Phase 1 — Pilot (Months 1–3)
- One hospital, 100–200 discharged patients per month
- Hindi + English only
- Measure: readmission reduction, alert accuracy, patient satisfaction

### Phase 2 — City-Level Rollout (Months 4–9)
- Integrate with Hospital Management Systems (HMS)
- Expand to Hindi + 3 regional languages
- Multi-hospital dashboard

### Phase 3 — National Scale (Months 10+)
- Integrate with Ayushman Bharat Digital Mission (ABDM) patient records
- Deploy via Bhashini across government hospitals
- All 22 Indian scheduled languages

> **Language Expansion:** New language support requires only plugging in a new Bhashini language model — zero architectural changes.

---

## 11. Impact Metrics & Success Criteria

### For Patients
- Early detection of post-discharge complications
- Recovery guidance in their own language
- Reduced preventable emergency readmissions

### For Doctors
- Zero extra workload for routine follow-ups
- Dashboard ranked by risk level
- Documented transcripts for patient progress review

### For Hospitals
- **20–40% potential reduction** in preventable 30-day readmissions
- Cost savings: one prevented readmission > cost of hundreds of AI follow-up calls
- Improved NABH accreditation scores

### Economics
| Item | Cost / Value |
|------|-------------|
| AI follow-up call cost | ₹5–10 per call |
| Prevented readmission saving | ₹15,000–₹1,00,000 |
| ROI | Unambiguously positive at any scale |

---

## 12. Innovation Summary

| Differentiator | Description |
|---------------|-------------|
| 🇮🇳 **Voice-first for India's reality** | Works on a standard phone call — meets patients where they are |
| 🗣️ **Truly multilingual** | Understands regional phrases, colloquialisms, dialect nuances — not just translation |
| 📡 **Proactive, not reactive** | Reaches out on schedule rather than waiting for patients to call |
| 🧠 **AI understands vague human language** | "mujhe thoda saans lene mein takleef ho rahi hai" → dyspnea |
| 🏛️ **Bhashini-powered — government ready** | Positioned for government hospital deployment without per-language licensing costs |
| 🚫 **No existing equivalent** | No current solution combines intelligent conversation + multilingual voice + India-scale telephony |

---

## 13. Tech Stack at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                            │
│  React 18 · TypeScript · Tailwind CSS · Socket.IO       │
│  React Query · Recharts · i18next · React Router        │
├─────────────────────────────────────────────────────────┤
│                     BACKEND                             │
│  Python 3.11 · FastAPI · Celery · APScheduler          │
│  SQLAlchemy · Pydantic · JWT · Redis                    │
├─────────────────────────────────────────────────────────┤
│                   TELEPHONY                             │
│  Exotel (Primary) · Twilio (Fallback) · MSG91          │
├─────────────────────────────────────────────────────────┤
│                  SPEECH AI                              │
│  Bhashini STT/TTS · Google Cloud STT · Azure TTS       │
├─────────────────────────────────────────────────────────┤
│                   AI / LLM                              │
│  GPT-4o · LangChain · IndicBERT · XGBoost · FAISS      │
│  spaCy NER · OpenAI Embeddings · LlamaIndex            │
├─────────────────────────────────────────────────────────┤
│                  DATABASE                               │
│  PostgreSQL 16 · Redis 7 · AWS S3 / MinIO              │
├─────────────────────────────────────────────────────────┤
│                NOTIFICATIONS                            │
│  Socket.IO · WhatsApp Business API · FCM · SendGrid    │
├─────────────────────────────────────────────────────────┤
│               INFRASTRUCTURE                            │
│  AWS (Mumbai) · Docker · Kubernetes (EKS)              │
│  Prometheus · Grafana · Sentry · ELK · GitHub Actions  │
└─────────────────────────────────────────────────────────┘
```

---

*Smart VoiceCare — Built for India. Built for every language. Built for every phone.*
