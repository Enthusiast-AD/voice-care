import { useState } from 'react';
import { fetchWithAuth } from '../../lib/api';
import { X } from 'lucide-react';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPatientModal({ isOpen, onClose, onSuccess }: AddPatientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    language_preference: 'English',
    primary_diagnosis: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetchWithAuth('/patients', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: '',
        phone_number: '',
        language_preference: 'English',
        primary_diagnosis: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl text-primary mb-6">Add New Patient</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name *</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number *</label>
            <input 
              type="tel" 
              required
              value={formData.phone_number}
              onChange={e => setFormData({...formData, phone_number: e.target.value})}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. +91 9876543210"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Language Preference</label>
            <select
              value={formData.language_preference}
              onChange={e => setFormData({...formData, language_preference: e.target.value})}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Primary Diagnosis</label>
            <input 
              type="text" 
              value={formData.primary_diagnosis}
              onChange={e => setFormData({...formData, primary_diagnosis: e.target.value})}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. Hypertension"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-secondary/50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}