import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { getRiskColor } from "../data/mockData";
import { usePatients } from "../data/usePatients";
import { useCalls } from "../data/useCalls";
import { useAppointments } from "../data/useAppointments";
import { toast } from "sonner";
import { Users, AlertTriangle, Phone, TrendingUp, Clock, Bell } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Link } from "react-router";
import { Badge } from "../components/ui/Badge";

export function DoctorDashboard() {
  const { patients } = usePatients();
  const { calls } = useCalls();
  const { appointments, approveAppointment } = useAppointments();

  const pendingAppointments = appointments.filter(a => a.status === "PENDING" || a.status === "pending");

  const stats = {
    criticalCount: patients.filter(p => p.risk_classification === 'Critical' || p.riskLevel === 'critical').length,
    highCount: patients.filter(p => p.risk_classification === 'High' || p.riskLevel === 'high').length,
    callsCompleted: calls.filter(c => c.status === 'completed').length,
    callsToday: calls.length,
    pendingAlerts: calls.filter(c => ['High', 'Critical'].includes(c.risk_classification || '')).length
  };

  const riskDistribution = [
    { name: "Low", value: patients.filter(p => p.riskLevel === 'low').length, color: "#4CAF50" },
    { name: "Medium", value: patients.filter(p => p.riskLevel === 'medium').length, color: "#FFA726" },
    { name: "High", value: patients.filter(p => p.riskLevel === 'high').length, color: "#FF7043" },
    { name: "Critical", value: patients.filter(p => p.riskLevel === 'critical').length, color: "#E53935" },
  ];

  const weeklyTrend = [
    { day: "Mon", calls: 8, alerts: 1 },
    { day: "Tue", calls: 12, alerts: 2 },
    { day: "Wed", calls: 10, alerts: 0 },
    { day: "Thu", calls: 15, alerts: 3 },
    { day: "Fri", calls: 11, alerts: 1 },
    { day: "Sat", calls: 9, alerts: 2 },
    { day: "Sun", calls: 7, alerts: 0 },
  ];

  const recentAlerts = calls
    .filter(call => ['high', 'critical'].includes((call.risk_classification || '').toLowerCase()))
    .map(call => ({
      id: call.id,
      patientId: call.patient_id,
      patientName: call.patient?.name || 'Unknown Patient',
      riskLevel: (call.risk_classification || 'High').toLowerCase(),
      timestamp: call.started_at || call.created_at,
      symptoms: Array.isArray(call.symptoms) 
        ? call.symptoms.map(s => String(s))
        : typeof call.symptoms === 'object' && call.symptoms !== null 
          ? Object.values(call.symptoms).map(s => String(s))
          : typeof call.symptoms === 'string' ? [call.symptoms] : []
    }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  const criticalPatients = patients
    .filter(p => p.riskLevel === "critical" || p.riskLevel === "high")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl text-[#166F63] mb-2">Dashboard</h1>
        <p className="text-[#5A7470]">Overview of patient monitoring and alerts</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#166F63] to-[#2D9A8C] text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Users size={24} className="opacity-80" />
              <span className="text-3xl">{patients.length}</span>
            </div>
            <p className="text-sm opacity-90">Total Patients</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#E53935] to-[#FF5252] text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle size={24} className="opacity-80" />
              <span className="text-3xl">{stats.criticalCount + stats.highCount}</span>
            </div>
            <p className="text-sm opacity-90">Critical & High Risk</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#E8B84E] to-[#FFB74D] text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Phone size={24} className="opacity-80" />
              <span className="text-3xl">{stats.callsCompleted}/{stats.callsToday}</span>
            </div>
            <p className="text-sm opacity-90">Calls Today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#FFA726] to-[#FF9800] text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Bell size={24} className="opacity-80" />
              <span className="text-3xl">{stats.pendingAlerts}</span>
            </div>
            <p className="text-sm opacity-90">Pending Alerts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {riskDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#1A3A36]">{item.name}</span>
                  </div>
                  <span className="text-[#5A7470]">{item.value} patients</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Weekly Call Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F0" />
                  <XAxis dataKey="day" stroke="#5A7470" />
                  <YAxis stroke="#5A7470" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid rgba(45,154,140,0.15)",
                      borderRadius: "8px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calls" 
                    stroke="#2D9A8C" 
                    strokeWidth={3}
                    name="Calls"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="alerts" 
                    stroke="#E53935" 
                    strokeWidth={3}
                    name="Alerts"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} className="text-[#E53935]" />
                Recent Alerts
              </CardTitle>
              <Link 
                to="/dashboard/alerts"
                className="text-sm text-[#2D9A8C] hover:text-[#166F63]"
              >
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="p-4 rounded-lg border border-[rgba(45,154,140,0.15)] hover:border-[#2D9A8C] transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link to={`/dashboard/patients/${alert.patientId}`}>
                        <h4 className="text-[#1A3A36] hover:text-[#166F63]">{alert.patientName}</h4>
                      </Link>
                      <p className="text-xs text-[#5A7470]">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={alert.riskLevel}>{alert.riskLevel}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {alert.symptoms.slice(0, 2).map((symptom, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-[#EDF2F0] text-[#1A7A6E] px-2 py-1 rounded"
                      >
                        {symptom}
                      </span>
                    ))}
                    {alert.symptoms.length > 2 && (
                      <span className="text-xs bg-[#EDF2F0] text-[#1A7A6E] px-2 py-1 rounded">
                        +{alert.symptoms.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical/High Risk Patients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-[#FF7043]" />
                Priority Patients
              </CardTitle>
              <Link 
                to="/dashboard/patients"
                className="text-sm text-[#2D9A8C] hover:text-[#166F63]"
              >
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalPatients.map((patient) => (
                <Link
                  key={patient.id}
                  to={`/dashboard/patients/${patient.id}`}
                  className="block p-3 rounded-lg border border-[rgba(45,154,140,0.15)] hover:border-[#2D9A8C] hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[#1A3A36]">{patient.name}</h4>
                    <Badge variant={patient.riskLevel}>{patient.riskLevel}</Badge>
                  </div>
                  <p className="text-sm text-[#5A7470] mb-1">{patient.diagnosis}</p>
                  <div className="flex items-center gap-2 text-xs text-[#5A7470]">
                    <Clock size={12} />
                    Last call: {new Date(patient.lastCallDate).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Pending Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} className="text-[#2D9A8C]" />
                Pending Appointments
              </CardTitle>
              <Link 
                to="/dashboard/schedule"
                className="text-sm text-[#2D9A8C] hover:text-[#166F63]"
              >
                View full schedule →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {pendingAppointments.length === 0 ? (
              <p className="text-[#5A7470]">No pending appointments right now.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingAppointments.map((appt) => (
                  <div key={appt.id} className="p-4 border rounded-lg bg-white flex justify-between items-center">
                    <div>
                      <p className="font-medium text-[#1A3A36]">{appt.patient?.name || "Unknown Patient"}</p>
                      <p className="text-sm text-[#5A7470]">
                        Requested: {new Date(appt.proposed_date || appt.proposed_time).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Reason: {appt.patient?.primary_diagnosis || "General Follow-up"}
                      </p>
                    </div>
                    <div>
                      <button 
                        onClick={async () => {
                          try {
                            await approveAppointment(appt.id);
                            toast.success("Appointment Approved & SMS sent to patient!");
                          } catch (e) {
                            toast.error("Failed to approve appointment");
                          }
                        }}
                        className="px-4 py-2 bg-[#2D9A8C] text-white rounded hover:bg-[#166F63] transition-colors text-sm font-medium"
                      >
                        Approve Time
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
