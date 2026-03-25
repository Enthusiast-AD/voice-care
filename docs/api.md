# 📡 Smart VoiceCare API Documentation

This document outlines the REST API endpoints available in the Smart VoiceCare backend. The API is built using Node.js and Express, with Supabase as the database and Twilio/Ultravox for voice interactions.

## Base URL
```
http://localhost:5000/api
```
*(Assuming default port 5000, update based on your environment)*

## Authentication
Currently, the API endpoints are internal/private and do not require separate JWT authentication in development. Ensure proper authorization when deploying to production.

---

## 🏥 Health & System

### 1. Root Check
Verify if the API framework is properly mapped and responding.

- **URL:** `/`
- **Method:** `GET`
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "message": "Smart VoiceCare API is running 🚀",
      "version": "1.0.0",
      "environment": "development"
    }
    ```

### 2. Health Route
Dedicated health check for the API infrastructure.

- **URL:** `/api/health`
- **Method:** `GET`
- **Success Response:**
  - **Code:** `200 OK`

---

## 👥 Patients

### 3. Get All Patients
Retrieves a list of all discharged patients, ordered by creation date.

- **URL:** `/api/patients`
- **Method:** `GET`
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "data": [
        {
          "id": "uuid-1234",
          "name": "Ramesh Kumar",
          "phone_number": "+919876543210",
          "language_preference": "Hindi",
          "primary_diagnosis": "Post-Op Cardiac",
          "created_at": "2024-03-25T10:00:00Z"
        }
      ],
      "message": "Patients retrieved successfully"
    }
    ```

### 4. Add a New Patient
Registers a new discharged patient for automated follow-up voice care.

- **URL:** `/api/patients`
- **Method:** `POST`
- **Body payload:**
  ```json
  {
      "name": "Jane Doe",
      "phone_number": "+919876543210",
      "language_preference": "English", 
      "primary_diagnosis": "Orthopedic Surgery"
  }
  ```
- **Notes:** 
  - `language_preference` is optional, defaults to 'Hindi'.
  - `primary_diagnosis` is optional, defaults to 'General'.
- **Success Response:**
  - **Code:** `201 Created`
  - **Content:**
    ```json
    {
      "success": true,
      "statusCode": 201,
      "data": {
        "id": "uuid-1235",
        "name": "Jane Doe",
        "phone_number": "+919876543210",
        "language_preference": "English",
        "primary_diagnosis": "Orthopedic Surgery",
        "created_at": "2024-03-25T11:00:00Z"
      },
      "message": "Patient added successfully"
    }
    ```
- **Error Response:**
  - **Code:** `400 Bad Request` (Missing required fields like `name` or `phone_number`)

---

## 📞 Calls

### 5. Trigger Patient Call
Triggers an automated outbound AI voice call to a specific patient using Twilio.

- **URL:** `/api/calls/trigger`
- **Method:** `POST`
- **Body payload:**
  ```json
  {
      "patient_id": "uuid-1235"
  }
  ```
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "data": {
        "sid": "CA123456789...",
        "status": "initiated"
      },
      "message": "Call triggered successfully"
    }
    ```
- **Error Response:**
  - **Code:** `404 Not Found` (Patient ID does not exist)

---

## 🪝 Webhooks

### 6. Ultravox AI Call Webhook
Receives the post-call summary, extracted symptoms, and risk classification from the Ultravox AI voice workflow. Automatically inserts logs natively into Supabase and triggers alerts if the risk is High or Critical.

- **URL:** `/api/webhooks/ultravox`
- **Method:** `POST`
- **Body payload:**
  ```json
  {
      "call_id": "CA123456789...",
      "patient_id": "uuid-1235",
      "transcript": "Hello, how are you feeling? I have some chest pain...",
      "extracted_symptoms": ["chest pain", "shortness of breath"],
      "risk_score": "High"
  }
  ```
- **Notes:** 
  - `risk_score` typically categorized as `Low`, `Medium`, `High`, or `Critical`.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "data": {
        "id": "uuid-call-log-555",
        "call_id": "CA123456789...",
        "patient_id": "uuid-1235",
        "transcript": "Hello, how are you feeling...",
        "symptoms": ["chest pain", "shortness of breath"],
        "risk_classification": "High",
        "completed_at": "2024-03-25T11:15:00Z"
      },
      "message": "Webhook processed and logged successfully"
    }
    ```