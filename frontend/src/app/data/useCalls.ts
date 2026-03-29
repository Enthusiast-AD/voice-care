import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../lib/api';

export interface CallLog {
  id: string;
  call_id: string;
  patient_id: string;
  status: string;
  transcript?: string;
  structured_transcript?: any;
  symptoms?: any;
  risk_classification?: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
  patient?: any;
}

export const useCalls = () => {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCalls = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth('/calls');
      const formatted = (res.data || []).map((c: any) => ({ ...c, risk_classification: c.risk_classification ? c.risk_classification.toLowerCase() : undefined, }));
      setCalls(formatted);
    } catch (err: any) {
      console.error("Failed to load calls:", err);
      setError(err.message || 'Failed to load calls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();
  }, []);

  return { calls, loading, error, refetch: loadCalls };
};
