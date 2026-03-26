// Mock data for the Smart VoiceCare platform

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  language: string;
  diagnosis: string;
  diagnosisCode: string;
  dischargeDate: string;
  assignedDoctorId: string;
  lastCallDate: string;
  riskLevel: RiskLevel;
  riskScore: number;
}

export interface CallSession {
  id: string;
  patientId: string;
  date: string;
  duration: string;
  riskLevel: RiskLevel;
  riskScore: number;
  symptoms: string[];
  transcript?: string;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  riskLevel: RiskLevel;
  timestamp: string;
  symptoms: string[];
  acknowledged: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  hospitalId: string;
}

export const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "Rajesh Kumar",
    age: 58,
    phone: "+91 98765 43210",
    language: "Hindi",
    diagnosis: "Post Cardiac Surgery",
    diagnosisCode: "CARDIAC",
    dischargeDate: "2026-03-18",
    assignedDoctorId: "D001",
    lastCallDate: "2026-03-23",
    riskLevel: "critical",
    riskScore: 0.92,
  },
  {
    id: "P002",
    name: "Priya Sharma",
    age: 45,
    phone: "+91 98765 43211",
    language: "English",
    diagnosis: "Diabetic Foot Surgery",
    diagnosisCode: "DIABETIC",
    dischargeDate: "2026-03-15",
    assignedDoctorId: "D001",
    lastCallDate: "2026-03-23",
    riskLevel: "high",
    riskScore: 0.75,
  },
  {
    id: "P003",
    name: "Amit Patel",
    age: 62,
    phone: "+91 98765 43212",
    language: "Gujarati",
    diagnosis: "Knee Replacement",
    diagnosisCode: "ORTHOPAEDIC",
    dischargeDate: "2026-03-20",
    assignedDoctorId: "D002",
    lastCallDate: "2026-03-24",
    riskLevel: "medium",
    riskScore: 0.48,
  },
  {
    id: "P004",
    name: "Lakshmi Reddy",
    age: 51,
    phone: "+91 98765 43213",
    language: "Telugu",
    diagnosis: "Appendectomy",
    diagnosisCode: "SURGICAL",
    dischargeDate: "2026-03-21",
    assignedDoctorId: "D001",
    lastCallDate: "2026-03-24",
    riskLevel: "low",
    riskScore: 0.22,
  },
  {
    id: "P005",
    name: "Mohammed Ali",
    age: 67,
    phone: "+91 98765 43214",
    language: "Urdu",
    diagnosis: "Angioplasty",
    diagnosisCode: "CARDIAC",
    dischargeDate: "2026-03-19",
    assignedDoctorId: "D002",
    lastCallDate: "2026-03-23",
    riskLevel: "high",
    riskScore: 0.68,
  },
  {
    id: "P006",
    name: "Sunita Devi",
    age: 39,
    phone: "+91 98765 43215",
    language: "Hindi",
    diagnosis: "Gallbladder Surgery",
    diagnosisCode: "SURGICAL",
    dischargeDate: "2026-03-22",
    assignedDoctorId: "D001",
    lastCallDate: "2026-03-24",
    riskLevel: "low",
    riskScore: 0.18,
  },
  {
    id: "P007",
    name: "Suresh Rao",
    age: 55,
    phone: "+91 98765 43216",
    language: "Kannada",
    diagnosis: "Bypass Surgery",
    diagnosisCode: "CARDIAC",
    dischargeDate: "2026-03-17",
    assignedDoctorId: "D002",
    lastCallDate: "2026-03-24",
    riskLevel: "medium",
    riskScore: 0.52,
  },
  {
    id: "P008",
    name: "Fatima Khan",
    age: 43,
    phone: "+91 98765 43217",
    language: "Hindi",
    diagnosis: "Hip Replacement",
    diagnosisCode: "ORTHOPAEDIC",
    dischargeDate: "2026-03-16",
    assignedDoctorId: "D001",
    lastCallDate: "2026-03-23",
    riskLevel: "low",
    riskScore: 0.31,
  },
];

export const mockCallSessions: CallSession[] = [
  {
    id: "C001",
    patientId: "P001",
    date: "2026-03-23",
    duration: "4:32",
    riskLevel: "critical",
    riskScore: 0.92,
    symptoms: [
      "Severe chest pain",
      "Shortness of breath",
      "Irregular heartbeat",
    ],
    transcript: "Patient: Mujhe seene mein bahut dard ho raha hai...",
  },
  {
    id: "C002",
    patientId: "P001",
    date: "2026-03-21",
    duration: "3:45",
    riskLevel: "medium",
    riskScore: 0.55,
    symptoms: ["Mild chest discomfort", "Fatigue"],
    transcript: "Patient: Thodi weakness mehsoos ho rahi hai...",
  },
  {
    id: "C003",
    patientId: "P002",
    date: "2026-03-23",
    duration: "5:12",
    riskLevel: "high",
    riskScore: 0.75,
    symptoms: ["Foot swelling", "Redness", "Elevated blood sugar"],
    transcript: "Patient: My foot is swollen and there is some redness...",
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "A001",
    patientId: "P001",
    patientName: "Rajesh Kumar",
    riskLevel: "critical",
    timestamp: "2026-03-24T10:45:00",
    symptoms: [
      "Severe chest pain",
      "Shortness of breath",
      "Irregular heartbeat",
    ],
    acknowledged: false,
  },
  {
    id: "A002",
    patientId: "P002",
    patientName: "Priya Sharma",
    riskLevel: "high",
    timestamp: "2026-03-24T09:30:00",
    symptoms: ["Foot swelling", "Redness", "Elevated blood sugar"],
    acknowledged: false,
  },
  {
    id: "A003",
    patientId: "P005",
    patientName: "Mohammed Ali",
    riskLevel: "high",
    timestamp: "2026-03-23T16:20:00",
    symptoms: ["Chest discomfort", "Dizziness"],
    acknowledged: true,
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: "D001",
    name: "Dr. Anil Mehta",
    email: "anil.mehta@hospital.com",
    phone: "+91 98765 11111",
    specialty: "Cardiology",
    hospitalId: "H001",
  },
  {
    id: "D002",
    name: "Dr. Sneha Gupta",
    email: "sneha.gupta@hospital.com",
    phone: "+91 98765 22222",
    specialty: "Orthopedics",
    hospitalId: "H001",
  },
];

export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case "low":
      return "text-green-600";
    case "medium":
      return "text-yellow-600";
    case "high":
      return "text-orange-600";
    case "critical":
      return "text-red-600";
  }
};

export const getRiskBgColor = (level: RiskLevel): string => {
  switch (level) {
    case "low":
      return "bg-green-100";
    case "medium":
      return "bg-yellow-100";
    case "high":
      return "bg-orange-100";
    case "critical":
      return "bg-red-100";
  }
};

export const getRiskBadgeClass = (level: RiskLevel): string => {
  return `${getRiskBgColor(level)} ${getRiskColor(level)}`;
};

export const getDashboardStats = () => {
  const totalPatients = mockPatients.length;
  const criticalCount = mockPatients.filter(
    (p) => p.riskLevel === "critical",
  ).length;
  const highCount = mockPatients.filter((p) => p.riskLevel === "high").length;
  const mediumCount = mockPatients.filter(
    (p) => p.riskLevel === "medium",
  ).length;
  const lowCount = mockPatients.filter((p) => p.riskLevel === "low").length;

  const totalCalls = mockCallSessions.length;
  const activeAlerts = mockAlerts.filter((a) => !a.acknowledged).length;

  return {
    totalPatients,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    totalCalls,
    activeAlerts,
    callsToday: 24,
    callsCompleted: 18,
    pendingAlerts: activeAlerts,
    averageRisk: 0.42, // Mock average
  };
};
