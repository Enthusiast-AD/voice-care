import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { mockPatients, getRiskBadgeClass, RiskLevel } from '../data/mockData';

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('all');

  // Get unique diagnoses
  const diagnoses = Array.from(new Set(mockPatients.map(p => p.diagnosisCode)));

  // Filter patients
  const filteredPatients = mockPatients
    .filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           patient.phone.includes(searchQuery);
      const matchesRisk = selectedRisk === 'all' || patient.riskLevel === selectedRisk;
      const matchesDiagnosis = selectedDiagnosis === 'all' || patient.diagnosisCode === selectedDiagnosis;
      return matchesSearch && matchesRisk && matchesDiagnosis;
    })
    .sort((a, b) => {
      // Sort by risk level (critical first)
      const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 text-primary">Patients</h1>
        <p className="text-muted-foreground">Manage and monitor all discharged patients</p>
      </div>

      {/* Filters */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Risk Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value as RiskLevel | 'all')}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Diagnosis Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={selectedDiagnosis}
              onChange={(e) => setSelectedDiagnosis(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option value="all">All Diagnoses</option>
              {diagnoses.map(diagnosis => (
                <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Phone</th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Diagnosis</th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Last Call</th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">
                  <div className="flex items-center gap-2">
                    Risk Level
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-primary">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">Age: {patient.age}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm">{patient.diagnosis}</div>
                      <div className="text-xs text-muted-foreground">{patient.language}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(patient.lastCallDate).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${getRiskBadgeClass(patient.riskLevel)}`}>
                        {patient.riskLevel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {(patient.riskScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/dashboard/patients/${patient.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <p>No patients found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-muted-foreground text-center">
        Showing {filteredPatients.length} of {mockPatients.length} patients
      </div>
    </div>
  );
}
