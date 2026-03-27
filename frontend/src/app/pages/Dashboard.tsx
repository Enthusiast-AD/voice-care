import { useState, useEffect } from 'react';
import { Users, Activity, Phone, AlertTriangle, TrendingUp, TrendingDown, PlayCircle, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getRiskBadgeClass, Patient } from '../data/mockData';
import { fetchWithAuth } from '../../lib/api';
import { useCalls } from '../data/useCalls';
import { Link } from 'react-router';

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { calls } = useCalls();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await fetchWithAuth('/patients');
        const realPatients: Patient[] = res.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          age: 0,
          phone: p.phone_number,
          language: p.language_preference || 'Hindi',
          diagnosis: p.primary_diagnosis || 'General',
          diagnosisCode: p.primary_diagnosis || 'General',
          dischargeDate: p.created_at,
          assignedDoctorId: 'N/A',
          lastCallDate: p.created_at,
          riskLevel: 'low', // Defaulting as backend doesn't provide it yet
          riskScore: 0.1,
        }));
        setPatients(realPatients);
      } catch (err) {
        console.error("Dashboard failed to load patients:", err);
      }
    };
    loadPatients();
  }, []);

  // Calculate stats
  const totalPatients = patients.length;
  // Calculate critical count based on call risk_classification if available, else fallback
  const recentAlerts = calls.filter(c => c.risk_classification === 'critical' || c.risk_classification === 'high')
                            .slice(0, 5)
                            .map((c, i) => ({
                              id: `a${i}`,
                              patientId: c.patient_id,
                              patientName: c.patient?.name || 'Unknown',
                              type: 'abnormal_symptoms',
                              severity: c.risk_classification,
                              message: 'High risk classified after call',
                              timestamp: c.created_at
                            }));

  const criticalCount = calls.filter(c => c.risk_classification === 'critical').length;
  const highCount = calls.filter(c => c.risk_classification === 'high').length;
  const mediumCount = calls.filter(c => c.risk_classification === 'medium').length;
  const lowCount = calls.filter(c => c.risk_classification === 'low').length || totalPatients; // default low

  const todaysCalls = calls.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length;
  const completedCalls = calls.filter(c => c.status === 'completed' && new Date(c.created_at).toDateString() === new Date().toDateString()).length;
  const pendingCalls = todaysCalls - completedCalls;

  // Risk distribution data
  const riskData = [
    { name: 'Critical', value: criticalCount, color: '#ef4444' },
    { name: 'High', value: highCount, color: '#f59e0b' },
    { name: 'Medium', value: mediumCount, color: '#f4c542' },
    { name: 'Low', value: lowCount, color: '#10b981' },
  ];

  // Trend data
  const trendData = [
    { day: 'Mon', calls: 22, alerts: 3 },
    { day: 'Tue', calls: 25, alerts: 5 },
    { day: 'Wed', calls: 20, alerts: 2 },
    { day: 'Thu', calls: 28, alerts: 4 },
    { day: 'Fri', calls: 24, alerts: 2 },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 text-primary">Dashboard</h1>
        <p className="text-muted-foreground">Real-time patient monitoring overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Patients */}
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <div className="text-3xl text-primary mb-1">{totalPatients}</div>
          <p className="text-sm text-muted-foreground">Total Patients Monitored</p>
        </div>

        {/* Critical + High Risk */}
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="flex items-center gap-1 text-sm text-red-600">
              <TrendingDown className="w-4 h-4" />
              -8%
            </span>
          </div>
          <div className="text-3xl text-red-600 mb-1">{criticalCount + highCount}</div>
          <p className="text-sm text-muted-foreground">High Priority Cases</p>
        </div>

        {/* Today's Calls */}
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <Phone className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
          <div className="text-3xl text-primary mb-1">{completedCalls}/{todaysCalls}</div>
          <p className="text-sm text-muted-foreground">Calls Completed Today</p>
          <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all" 
              style={{ width: `${(completedCalls / todaysCalls) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl text-orange-600 mb-1">
            {recentAlerts.length}
          </div>
          <p className="text-sm text-muted-foreground">Unacknowledged Alerts</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Distribution Pie Chart */}
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <h3 className="text-lg mb-4 text-primary">Risk Distribution</h3>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {riskData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground min-w-[60px]">{item.name}</span>
                  <span className="text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <h3 className="text-lg mb-4 text-primary">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0ebe9" />
              <XAxis dataKey="day" stroke="#5a7070" />
              <YAxis stroke="#5a7070" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e0ebe9',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="#0d6e6e" 
                strokeWidth={2}
                name="Calls"
              />
              <Line 
                type="monotone" 
                dataKey="alerts" 
                stroke="#f4c542" 
                strokeWidth={2}
                name="Alerts"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-primary">Recent Alerts</h3>
          <Link 
            to="/dashboard/alerts"
            className="text-sm text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <div 
              key={alert.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRiskBadgeClass(alert.severity as any)}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <Link 
                    to={`/dashboard/patients/${alert.patientId}`}
                    className="hover:underline text-primary"
                  >
                    {alert.patientName}
                  </Link>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(alert.timestamp).toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {alert.symptoms.slice(0, 2).map((symptom, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-secondary px-2 py-1 rounded"
                    >
                      {symptom}
                    </span>
                  ))}
                  {alert.symptoms.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{alert.symptoms.length - 2} more
                    </span>
                  )}
                </div>
                {!alert.acknowledged && (
                  <button className="text-xs text-primary hover:underline">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
