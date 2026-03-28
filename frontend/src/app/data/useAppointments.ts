import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../lib/api';

export interface Appointment {
  id: string;
  patient_id: string;
  proposed_time: string;
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
      const res = await fetchWithAuth('/patients/appointments');
      setAppointments(res.data || []);
    } catch (err: any) {
      console.error("Failed to load appointments:", err);
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const approveAppointment = async (id: string) => {
    try {
      await fetchWithAuth(`/patients/appointments/${id}/approve`, {
        method: 'POST'
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

  return { appointments, loading, error, refetch: loadAppointments, approveAppointment };
};