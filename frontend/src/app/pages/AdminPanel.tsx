import { useState } from 'react';
import { Link } from 'react-router';
import { Users, UserPlus, Settings, Phone, BarChart3, LogOut, Calendar, Clock } from 'lucide-react';
import { useAppointments } from '../data/useAppointments';
import { toast } from 'sonner';
import { mockDoctors } from '../data/mockData';
import { usePatients } from '../data/usePatients';
import { AddPatientModal } from '../components/AddPatientModal';

type AdminView = 'patients' | 'doctors' | 'stats' | 'appointments';

export default function AdminPanel() {
  const { patients: mockPatients, refetch: refetchPatients } = usePatients();
  const { appointments, approveAppointment } = useAppointments();
  const pendingAppointments = appointments.filter(a => a.status === 'PENDING' || a.status === 'pending');
  const [activeView, setActiveView] = useState<AdminView>('patients');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8 text-sidebar-primary" />
            <div>
              <h1 className="text-lg">Smart VoiceCare</h1>
              <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'appointments'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Appointments</span>
          </button>
          <button
            onClick={() => setActiveView('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'patients'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Patient Management</span>
          </button>
          <button
            onClick={() => setActiveView('doctors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'doctors'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Doctor Management</span>
          </button>
          <button
            onClick={() => setActiveView('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'stats'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Statistics</span>
          </button>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">Admin User</p>
              <p className="text-xs text-sidebar-foreground/70">Administrator</p>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        {/* Patient Management View */}
        {activeView === 'patients' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl mb-2 text-primary">Patient Management</h1>
                <p className="text-muted-foreground">Add, edit, and manage discharged patients</p>
              </div>
              <button 
                onClick={() => setShowAddPatientModal(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Add New Patient
              </button>
            </div>

            {/* Add Patient Modal */}
            <AddPatientModal 
              isOpen={showAddPatientModal}
              onClose={() => setShowAddPatientModal(false)}
              onSuccess={refetchPatients}
            />

            {/* Patients Table */}
            <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Patient ID</th>
                    <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Name</th>
                    <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Diagnosis</th>
                    <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Assigned Doctor</th>
                    <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Discharge Date</th>
                    <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-muted-foreground">{patient.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-primary">{patient.name}</div>
                          <div className="text-xs text-muted-foreground">{patient.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{patient.diagnosis}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {mockDoctors.find(d => d.id === patient.assignedDoctorId)?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(patient.dischargeDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="text-primary hover:underline text-sm">Edit</button>
                          <button className="text-red-600 hover:underline text-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        
        {/* Appointments View */}
        {activeView === 'appointments' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl mb-2 text-primary">Appointment Management</h1>
                <p className="text-muted-foreground">Review and approve patient appointments</p>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-md border border-border p-6 mb-8">
              <h2 className="text-xl mb-4 text-[#1A3A36] flex items-center gap-2">
                <Clock className="text-[#2D9A8C]" size={20} />
                Pending Approvals
              </h2>
              {pendingAppointments.length === 0 ? (
                <p className="text-[#5A7470]">No pending appointments requiring approval.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingAppointments.map((appt) => (
                     <div key={appt.id} className="p-4 border border-[rgba(45,154,140,0.15)] rounded-lg bg-background flex flex-col justify-between items-start gap-4">
                      <div>
                        <p className="font-medium text-[#1A3A36] text-lg">{appt.patient?.name || "Unknown Patient"}</p>
                        <p className="text-sm text-[#5A7470] mt-1">
                          Requested Date: {new Date(appt.proposed_date || appt.proposed_time).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Reason: {appt.patient?.primary_diagnosis || "Follow-up"}
                        </p>
                      </div>
                      <button 
                        onClick={async () => {
                          try {
                            await approveAppointment(appt.id);
                            toast.success("Appointment Approved & SMS sent to patient!");
                          } catch (e) {
                            toast.error("Failed to approve appointment.");
                          }
                        }}
                        className="px-4 py-2 w-full bg-[#2D9A8C] text-white rounded-lg hover:bg-[#166F63] transition-colors font-medium"
                      >
                        Approve Appointment
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-card rounded-xl shadow-md border border-border p-6">
              <h2 className="text-xl mb-4 text-[#1A3A36]">All Appointments</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-border text-muted-foreground">
                      <th className="pb-3 font-medium px-4">Patient</th>
                      <th className="pb-3 font-medium px-4">Proposed Time</th>
                      <th className="pb-3 font-medium px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt.id} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-4 px-4 text-primary">{appt.patient?.name || "Unknown"}</td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {new Date(appt.proposed_date || appt.proposed_time).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            appt.status.toLowerCase() === 'pending' ? 'bg-[#EDF2F0] text-[#1A7A6E]' :
                            appt.status.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Management View */}
        {activeView === 'doctors' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl mb-2 text-primary">Doctor Management</h1>
                <p className="text-muted-foreground">Manage doctors and their specialties</p>
              </div>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add New Doctor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-card p-6 rounded-xl shadow-md border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl text-primary">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg text-primary mb-1">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                    </div>
                    <button className="text-primary hover:underline text-sm">Edit</button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {doctor.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {doctor.phone}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Assigned Patients: {mockPatients.filter(p => p.assignedDoctorId === doctor.id).length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics View */}
        {activeView === 'stats' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl mb-2 text-primary">Platform Statistics</h1>
              <p className="text-muted-foreground">Overall system performance and metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card p-6 rounded-xl shadow-md border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl text-primary">{mockPatients.length}</div>
                    <p className="text-sm text-muted-foreground">Total Patients</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-md border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl text-primary">{mockDoctors.length}</div>
                    <p className="text-sm text-muted-foreground">Active Doctors</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-md border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl text-green-600">156</div>
                    <p className="text-sm text-muted-foreground">Total Calls (7 days)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md border border-border">
              <h2 className="text-xl mb-6 text-primary">Language Distribution</h2>
              <div className="space-y-3">
                {['Hindi', 'English', 'Telugu', 'Gujarati', 'Kannada', 'Urdu'].map((lang, idx) => {
                  const count = mockPatients.filter(p => p.language === lang).length;
                  const percentage = (count / mockPatients.length) * 100;
                  return (
                    <div key={lang}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{lang}</span>
                        <span className="text-sm text-primary">{count} patients</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent transition-all" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Missing import
import { Mail } from 'lucide-react';
