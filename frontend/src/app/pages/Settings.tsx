import { Bell, MessageSquare, Mail, Smartphone } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 text-primary">Settings</h1>
        <p className="text-muted-foreground">Configure your notification preferences</p>
      </div>

      {/* Notification Settings */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-border mb-6">
        <h2 className="text-xl mb-6 text-primary">Notification Preferences</h2>
        
        <div className="space-y-6">
          {/* SMS Notifications */}
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="mb-1">SMS Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Receive text messages for high-priority patient alerts
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-switch-background peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* WhatsApp Notifications */}
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="mb-1">WhatsApp Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant alerts via WhatsApp with patient details
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-switch-background peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Push Notifications */}
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive real-time push notifications on your mobile device
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-switch-background peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Email Digest */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="mb-1">Daily Email Digest</h3>
                <p className="text-sm text-muted-foreground">
                  Receive a daily summary of all patient activities
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-switch-background peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-border">
        <h2 className="text-xl mb-6 text-primary">Alert Thresholds</h2>
        
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary border-border rounded focus:ring-ring" />
              <span className="text-sm">Notify on Critical risk level</span>
            </label>
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary border-border rounded focus:ring-ring" />
              <span className="text-sm">Notify on High risk level</span>
            </label>
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" className="w-4 h-4 text-primary border-border rounded focus:ring-ring" />
              <span className="text-sm">Notify on Medium risk level</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-primary border-border rounded focus:ring-ring" />
              <span className="text-sm">Notify on Low risk level</span>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
