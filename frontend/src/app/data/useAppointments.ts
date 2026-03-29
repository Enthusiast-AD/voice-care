import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../lib/api";

export interface Appointment {
  id: string;
  patient_id: string;
  proposed_date: string;
  proposed_session: string;
  status: string;
  created_at: string;
  patient: {
    id: string;
    name: string;
    phone_number: string;
    primary_diagnosis: string;
  };
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth("/patients/appointments");
      setAppointments(res.data || []);
    } catch (err: any) {
      console.error("Failed to load appointments:", err);
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const bookNewAppointment = async (patientId: string, proposedTime: Date | string) => {
    try {
      await fetchWithAuth("/patients/appointments", {
        method: "POST",
        body: JSON.stringify({
          patient_id: patientId,
          proposed_time: new Date(proposedTime).toISOString()
        })
      });
      await loadAppointments();
    } catch (err: any) {
      console.error("Failed to book:", err);
      throw err;
    }
  };

  const approveAppointment = async (id: string, newTime?: Date | string) => {
    try {
      await fetchWithAuth(`/patients/appointments/${id}/approve`, {
        method: "POST",
        body: newTime ? JSON.stringify({ new_time: new Date(newTime).toISOString() }) : undefined
      });
      await loadAppointments();
    } catch (err: any) {
      console.error("Failed to approve:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    refetch: loadAppointments,
    approveAppointment,
    bookNewAppointment,
  };
};
