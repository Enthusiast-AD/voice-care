import { Calendar, Clock, Phone, CheckCircle, XCircle } from 'lucide-react';

export default function Schedule() {
  // Mock schedule data
  const schedules = [
    { 
      id: 'S001', 
      patientId: 'P001', 
      patientName: 'Rajesh Kumar', 
      scheduledAt: '2026-03-24T10:00:00', 
      status: 'pending',
      callDay: 'Day 7'
    },
    { 
      id: 'S002', 
      patientId: 'P002', 
      patientName: 'Priya Sharma', 
      scheduledAt: '2026-03-24T11:30:00', 
      status: 'pending',
      callDay: 'Day 7'
    },
    { 
      id: 'S003', 
      patientId: 'P003', 
      patientName: 'Amit Patel', 
      scheduledAt: '2026-03-24T14:00:00', 
      status: 'pending',
      callDay: 'Day 3'
    },
    { 
      id: 'S004', 
      patientId: 'P004', 
      patientName: 'Lakshmi Reddy', 
      scheduledAt: '2026-03-24T15:30:00', 
      status: 'completed',
      callDay: 'Day 1'
    },
    { 
      id: 'S005', 
      patientId: 'P005', 
      patientName: 'Mohammed Ali', 
      scheduledAt: '2026-03-24T09:00:00', 
      status: 'failed',
      callDay: 'Day 7'
    },
  ];

  const pendingCalls = schedules.filter(s => s.status === 'pending');
  const completedCalls = schedules.filter(s => s.status === 'completed');
  const failedCalls = schedules.filter(s => s.status === 'failed');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 text-primary">Call Schedule</h1>
        <p className="text-muted-foreground">Automated follow-up call timeline</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <div className="text-2xl text-primary">{pendingCalls.length}</div>
              <p className="text-sm text-muted-foreground">Pending Today</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl text-green-600">{completedCalls.length}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl text-red-600">{failedCalls.length}</div>
              <p className="text-sm text-muted-foreground">Failed/Missed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-xl text-primary">Today's Schedule</h2>
        </div>

        <div className="space-y-4">
          {schedules
            .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
            .map((schedule) => {
              const time = new Date(schedule.scheduledAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={schedule.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                >
                  {/* Time */}
                  <div className="w-20 text-center">
                    <div className="text-lg text-primary">{time}</div>
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {schedule.status === 'pending' && (
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-accent-foreground" />
                      </div>
                    )}
                    {schedule.status === 'completed' && (
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                    {schedule.status === 'failed' && (
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                    )}
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1">
                    <div className="text-primary mb-1">{schedule.patientName}</div>
                    <div className="text-sm text-muted-foreground">
                      Post-discharge {schedule.callDay} follow-up
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {schedule.status === 'pending' && (
                      <span className="px-3 py-1 bg-accent/20 text-accent-foreground rounded-full text-sm capitalize">
                        Scheduled
                      </span>
                    )}
                    {schedule.status === 'completed' && (
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm capitalize">
                        Completed
                      </span>
                    )}
                    {schedule.status === 'failed' && (
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm capitalize">
                        Failed
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  {schedule.status === 'pending' && (
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call Now
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Upcoming Week */}
      <div className="mt-6 bg-card p-6 rounded-xl shadow-md border border-border">
        <h2 className="text-xl mb-4 text-primary">This Week Overview</h2>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <div key={day} className="text-center">
              <div className="text-sm text-muted-foreground mb-2">{day}</div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-lg text-primary">{20 + idx * 2}</div>
                <div className="text-xs text-muted-foreground">calls</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
