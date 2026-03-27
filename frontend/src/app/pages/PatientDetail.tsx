import { useParams, Link } from 'react-router';
import { ArrowLeft, Phone, Calendar, Languages, AlertCircle, FileText, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getRiskBadgeClass, getRiskColor } from '../data/mockData';
import { usePatients } from '../data/usePatients';
import { useCalls } from '../data/useCalls';
import { useState } from 'react';
import { fetchWithAuth } from '../../lib/api';

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const { patients, loading } = usePatients();
  const { calls } = useCalls();
  const [triggering, setTriggering] = useState(false);

  const patient = patients.find(p => p.id === id);
  const callHistory = calls.filter(c => c.patient_id === id);

  const handleCallNow = async () => {
    try {
      setTriggering(true);
      await fetchWithAuth('/calls/trigger', {
        method: 'POST',
        body: JSON.stringify({ patient_id: patient?.id })
      });
      alert('Call triggered successfully!');
    } catch(err: any) {
      alert(`Failed to trigger call: ${err.message}`);
    } finally {
      setTriggering(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading patient...</div>;
  }

  if (!patient) {
    return (
      <div className="p-8">
        <div className="bg-card p-12 rounded-xl shadow-md border border-border text-center">
          <p className="text-muted-foreground">Patient not found</p>
          <Link to="/dashboard/patients" className="text-primary hover:underline mt-4 inline-block">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  // Mock risk history data
  const riskHistory = [
    { day: 'Day 1', score: 0.3 },
    { day: 'Day 3', score: 0.55 },
    { day: 'Day 5', score: 0.72 },
    { day: 'Day 7', score: patient.riskScore },
  ];

  return (
    <div className="p-8">
      {/* Back Button */}
      <Link 
        to="/dashboard/patients"
        className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Patients
      </Link>

      {/* Patient Header */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-border mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl text-primary">
              {patient.name ? patient.name.split(' ').map(n => n[0]).join('') : '?'}
            </div>
            <div>
              <h1 className="text-3xl mb-2 text-primary">{patient.name || 'Unknown'}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {patient.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Age: {patient.age}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Languages className="w-4 h-4" />
                  {patient.language}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  Discharge: {new Date(patient.dischargeDate).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className={`px-4 py-2 rounded-full ${getRiskBadgeClass(patient.riskLevel)} text-lg capitalize`}>
              {patient.riskLevel} Risk
            </div>
            <button 
              onClick={handleCallNow}
              disabled={triggering}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {triggering ? "Initiating Call..." : "Call Patient Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <h3 className="text-sm text-muted-foreground mb-2">Diagnosis</h3>
          <p className="text-xl text-primary">{patient.diagnosis}</p>
          <p className="text-xs text-muted-foreground mt-1">{patient.diagnosisCode}</p>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <h3 className="text-sm text-muted-foreground mb-2">Current Risk Score</h3>
          <p className={`text-3xl ${getRiskColor(patient.riskLevel)}`}>
            {(patient.riskScore * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">Updated today</p>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <h3 className="text-sm text-muted-foreground mb-2">Total Calls</h3>
          <p className="text-3xl text-primary">{callHistory.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Last: {new Date(patient.lastCallDate).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      {/* Risk History Chart */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-border mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-xl text-primary">Risk Score History</h2>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={riskHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0ebe9" />
            <XAxis dataKey="day" stroke="#5a7070" />
            <YAxis domain={[0, 1]} stroke="#5a7070" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0ebe9',
                borderRadius: '8px'
              }}
              formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#0d6e6e"
              strokeWidth={3}
              dot={{ fill: '#0d6e6e', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Call History */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-primary" />
          <h2 className="text-xl text-primary">Call History</h2>
        </div>
        <div className="space-y-4">
          {(callHistory || []).map((call: any, index: number) => (
            <div key={call.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                    #{callHistory.length - index}
                  </div>
                  <div>
                    <p className="text-primary">
                      {new Date(call.created_at || call.started_at || new Date()).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">Duration: {call.duration || 'N/A'}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm capitalize ${getRiskBadgeClass(call.risk_classification || call.riskLevel || 'low')}`}>
                  {call.risk_classification || call.riskLevel || 'Low'}
                </div>
              </div>
              
              <div className="mb-3">
                <h4 className="text-sm mb-2 text-muted-foreground">Symptoms Reported:</h4>
                <div className="flex flex-wrap gap-2">
                  {(call.symptoms || []).map((symptom: string, idx: number) => (
                    <span key={idx} className="bg-secondary px-3 py-1 rounded-full text-sm">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              {call.transcript && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-primary hover:underline flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Transcript
                  </summary>
                  <div className="mt-3 p-4 bg-secondary/30 rounded-lg text-sm text-muted-foreground">
                    {call.transcript}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>

        {callHistory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No call history available yet
          </div>
        )}
      </div>
    </div>
  );
}
