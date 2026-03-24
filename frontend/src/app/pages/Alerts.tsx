import { useState } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { mockAlerts, getRiskBadgeClass } from '../data/mockData';

export default function Alerts() {
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all');

  const filteredAlerts = mockAlerts.filter(alert => {
    if (filter === 'unacknowledged') return !alert.acknowledged;
    if (filter === 'acknowledged') return alert.acknowledged;
    return true;
  });

  const unacknowledgedCount = mockAlerts.filter(a => !a.acknowledged).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 text-primary">Alerts</h1>
        <p className="text-muted-foreground">Real-time patient risk notifications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl text-red-600">{unacknowledgedCount}</div>
              <p className="text-sm text-muted-foreground">Needs Attention</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl text-green-600">
                {mockAlerts.filter(a => a.acknowledged).length}
              </div>
              <p className="text-sm text-muted-foreground">Acknowledged</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl text-primary">{mockAlerts.length}</div>
              <p className="text-sm text-muted-foreground">Total Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden mb-6">
        <div className="flex border-b border-border">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-6 py-4 text-sm transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-secondary/30'
            }`}
          >
            All Alerts ({mockAlerts.length})
          </button>
          <button
            onClick={() => setFilter('unacknowledged')}
            className={`flex-1 px-6 py-4 text-sm transition-colors ${
              filter === 'unacknowledged' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-secondary/30'
            }`}
          >
            Needs Attention ({unacknowledgedCount})
          </button>
          <button
            onClick={() => setFilter('acknowledged')}
            className={`flex-1 px-6 py-4 text-sm transition-colors ${
              filter === 'acknowledged' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-secondary/30'
            }`}
          >
            Acknowledged ({mockAlerts.filter(a => a.acknowledged).length})
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div 
            key={alert.id}
            className="bg-card p-6 rounded-xl shadow-md border border-border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRiskBadgeClass(alert.riskLevel)}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <Link 
                      to={`/dashboard/patients/${alert.patientId}`}
                      className="text-lg text-primary hover:underline"
                    >
                      {alert.patientName}
                    </Link>
                    <div className={`inline-block ml-3 px-3 py-1 rounded-full text-xs capitalize ${getRiskBadgeClass(alert.riskLevel)}`}>
                      {alert.riskLevel} Risk
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {alert.acknowledged ? (
                      <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                        <CheckCircle className="w-4 h-4" />
                        Acknowledged
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600 text-sm mt-1">
                        <Clock className="w-4 h-4" />
                        Pending
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm mb-2 text-muted-foreground">Symptoms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {alert.symptoms.map((symptom, idx) => (
                      <span key={idx} className="bg-secondary px-3 py-1 rounded-full text-sm">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/dashboard/patients/${alert.patientId}`}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    View Patient
                  </Link>
                  {!alert.acknowledged && (
                    <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-sm">
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="bg-card p-12 rounded-xl shadow-md border border-border text-center">
            <p className="text-muted-foreground">No alerts in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
