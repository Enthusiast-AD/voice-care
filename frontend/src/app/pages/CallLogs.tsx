import { Phone, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router';
import { getRiskBadgeClass } from '../data/mockData';
import { useCalls } from '../data/useCalls';
import { useMemo } from 'react';

export default function CallLogs() {
  const { calls: callLogs, loading, error } = useCalls();

  const totalCalls = callLogs.length;
  const completedCalls = callLogs.filter(c => c.status === 'completed').length;
  const failedCalls = callLogs.filter(c => c.status === 'failed').length;

  const avgDuration = useMemo(() => {
    if (!callLogs.length) return '0:00';
    let totalSeconds = 0;
    let completedCount = 0;
    callLogs.forEach(c => {
      if (c.status === 'completed' && c.started_at && c.completed_at) {
        totalSeconds += (new Date(c.completed_at).getTime() - new Date(c.started_at).getTime()) / 1000;
        completedCount++;
      }
    });
    if (!completedCount) return '0:00';
    const avgSecs = totalSeconds / completedCount;
    const mins = Math.floor(avgSecs / 60);
    const secs = Math.floor(avgSecs % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [callLogs]);

  if (loading) return <div className="p-8"><p>Loading calls...</p></div>;
  if (error) return <div className="p-8"><p className="text-red-500">Error: {error}</p></div>;

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
              {callLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link 
                      to={`/dashboard/patients/${log.patient_id}`}
                      className="text-primary hover:underline"
                    >
                      {log.patient ? log.patient.name : 'Unknown'}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {log.patient?.phone_number || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {log.started_at ? new Date(log.started_at).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {(log.started_at && log.completed_at) ? (() => {
                      const sec = Math.floor((new Date(log.completed_at).getTime() - new Date(log.started_at).getTime()) / 1000);
                      return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
                    })() : '-'}
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
                    {log.status === 'initiated' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                        <Clock className="w-4 h-4" />
                        Initiated
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {log.risk_classification ? (
                      <span className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${getRiskBadgeClass(log.risk_classification)}`}>
                        {log.risk_classification}
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
