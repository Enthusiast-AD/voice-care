import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../lib/api';
import { Patient } from './mockData';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth('/patients');
      const data = res.data || [];
      const realPatients: Patient[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        age: 0,
        phone: p.phone_number,
        language: p.language_preference || 'Hindi',
        diagnosis: p.primary_diagnosis || 'General',
        diagnosisCode: p.primary_diagnosis || 'General',
        flow_type: p.flow_type || 'Screening',
        dischargeDate: p.created_at,
        assignedDoctorId: 'N/A',
        lastCallDate: p.created_at,
        riskLevel: (p.call_logs && p.call_logs.length > 0 && p.call_logs[0].risk_classification) ? p.call_logs[0].risk_classification.toLowerCase() : 'low',
        riskScore: 0.1,
      }));
      setPatients(realPatients);
    } catch (err: any) {
      console.error("Failed to load patients:", err);
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return { patients, loading, error, refetch: loadPatients };
};
