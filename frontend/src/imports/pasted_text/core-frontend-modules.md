🖥️ Core Frontend Modules (What you MUST build)
1. 📊 Dashboard (Main Screen)

Purpose: Give doctors instant overview

Should include:

Total patients monitored
Risk distribution (Low / Medium / High / Critical)
Today’s calls completed / pending
Recent alerts (real-time)

👉 UI idea:

Top cards (KPIs)
Risk pie chart
Live alert feed
2. 👨‍⚕️ Patient List View

Purpose: Central place to track all patients

Features:

Table/list of patients
Columns:
Name
Phone
Diagnosis
Last call date
Risk level (color-coded)
Filters:
Risk level
Diagnosis
Date

👉 Important:

🔴 Critical patients always on top
3. 📄 Patient Detail Page

Most important screen

Should show:

Basic info (name, age, diagnosis, discharge date)
Risk score history (graph 📈)
Call history (timeline)
Extracted symptoms per call
Transcript (optional expandable)
Alerts triggered

👉 This is where doctors take decisions

4. 🚨 Real-Time Alerts System

Purpose: Zero delay in critical cases

Frontend behavior:

Instant popup/toast (Socket.IO)
Alert panel (like notifications tab)
Highlight patient in list

👉 Alert should show:

Patient name
Risk level
Top symptoms
5. 📞 Call Monitoring (Optional but powerful)
Live call status (ongoing / failed / completed)
Call logs
Duration
6. 📅 Schedule View

Purpose: Show upcoming calls

Calendar or list format
Day 1, 3, 7, 14 schedule
Missed calls
7. ⚙️ Admin Panel

(for hospital/admin users)

Includes:

Add/edit patients
Assign doctor
Set language preference
Configure call schedule
Manage doctors
8. 🔔 Notification Settings

Doctors can choose:

SMS / WhatsApp / App alerts
Only High & Critical alerts
🎨 UI Design Structure (Simple Layout)
Sidebar:
- Dashboard
- Patients
- Alerts
- Schedule
- Admin

Main Area:
- Dynamic content based on route
🎯 Key UX Principles (VERY IMPORTANT)
✅ Color-based risk system
Green = Low
Yellow = Medium
Orange = High
Red = Critical
✅ Everything prioritised by risk
✅ Minimal clicks → fast decisions
✅ Real-time updates (Socket.IO)