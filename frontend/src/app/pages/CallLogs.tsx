import { Phone, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { getRiskBadgeClass } from '../data/mockData';

export default function CallLogs() {
  const callLogs = [
    {
      id: 'CL001',
      patientId: 'P001',
      patientName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      startTime: '2026-03-24T10:45:00',
      endTime: '2026-03-24T10:49:32',
      duration: '4:32',
      status: 'completed',
      riskLevel: 'critical' as const
    },
    {
      id: 'CL002',
      patientId: 'P002',
      patientName: 'Priya Sharma',
      phone: '+91 98765 43211',
      startTime: '2026-03-24T09:30:00',
      endTime: '2026-03-24T09:35:12',
      duration: '5:12',
      status: 'completed',
      riskLevel: 'high' as const
    },
    {
      id: 'CL003',
      patientId: 'P003',
      patientName: 'Amit Patel',
      phone: '+91 98765 43212',
      startTime: '2026-03-24T11:00:00',
      endTime: null,
      duration: null,
      status: 'failed',
      riskLevel: null
    },
    {
      id: 'CL004',
      patientId: 'P004',
      patientName: 'Lakshmi Reddy',
      phone: '+91 98765 43213',
      startTime: '2026-03-23T15:20:00',
      endTime: '2026-03-23T15:23:45',
      duration: '3:45',
      status: 'completed',
      riskLevel: 'low' as const
    },
    {
      id: 'CL005',
      patientId: 'P005',
      patientName: 'Mohammed Ali',
      phone: '+91 98765 43214',
      startTime: '2026-03-23T14:10:00',
      endTime: '2026-03-23T14:16:30',
      duration: '6:30',
      status: 'completed',
      riskLevel: 'high' as const
    },
  ];

  const totalCalls = callLogs.length;
  const completedCalls = callLogs.filter(c => c.status === 'completed').length;
  const failedCalls = callLogs.filter(c => c.status === 'failed').length;
  const avgDuration = '4:45';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 text-primary">Call Logs</h1>
        <p className="text-muted-foreground">Complete history of all automated calls</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl text-primary">{totalCalls}</div>
              <p className="text-sm text-muted-foreground">Total Calls</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl text-green-600">{completedCalls}</div>
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
              <div className="text-2xl text-red-600">{failedCalls}</div>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <div className="text-2xl text-primary">{avgDuration}</div>
              <p className="text-sm text-muted-foreground">Avg Duration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call Logs Table */}
      <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Patient</th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Phone</th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Start Time</th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Duration</th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Risk Level</th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {callLogs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link 
                      to={`/dashboard/patients/${log.patientId}`}
                      className="text-primary hover:underline"
                    >
                      {log.patientName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {log.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(log.startTime).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {log.duration || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {log.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                    {log.status === 'failed' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                        <XCircle className="w-4 h-4" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {log.riskLevel ? (
                      <span className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${getRiskBadgeClass(log.riskLevel)}`}>
                        {log.riskLevel}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {log.status === 'completed' && (
                      <button className="text-primary hover:underline text-sm">
                        View Details
                      </button>
                    )}
                    {log.status === 'failed' && (
                      <button className="text-primary hover:underline text-sm flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
