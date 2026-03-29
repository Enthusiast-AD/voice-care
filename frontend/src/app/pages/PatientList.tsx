import { useState } from "react";
import { Link } from "react-router";
import { type RiskLevel } from "../data/mockData";
import { usePatients } from "../data/usePatients";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";
import { Search, Filter, Phone, Calendar } from "lucide-react";

export function PatientList() {
  const { patients: mockPatients, loading } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [diagnosisFilter, setDiagnosisFilter] = useState("all");

  const diagnoses = ["all", ...Array.from(new Set(mockPatients.map(p => p.diagnosis)))];

  // Sort by risk level (critical first)
  const riskOrder: Record<RiskLevel, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  
  const filteredPatients = mockPatients
    .filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.phone.includes(searchTerm);
      const matchesRisk = riskFilter === "all" || patient.riskLevel === riskFilter;
      const matchesDiagnosis = diagnosisFilter === "all" || patient.diagnosis === diagnosisFilter;
      return matchesSearch && matchesRisk && matchesDiagnosis;
    })
    .sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl text-[#166F63] mb-2">Patient List</h1>
        <p className="text-[#5A7470]">Monitor all discharged patients</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7470]" size={18} />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FAFBFB] border border-[rgba(45,154,140,0.15)] rounded-lg focus:outline-none focus:border-[#2D9A8C] text-[#1A3A36]"
              />
            </div>

            {/* Risk Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7470]" size={18} />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as RiskLevel | "all")}
                className="w-full pl-10 pr-4 py-2 bg-[#FAFBFB] border border-[rgba(45,154,140,0.15)] rounded-lg focus:outline-none focus:border-[#2D9A8C] text-[#1A3A36] appearance-none"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Diagnosis Filter */}
            <div>
              <select
                value={diagnosisFilter}
                onChange={(e) => setDiagnosisFilter(e.target.value)}
                className="w-full px-4 py-2 bg-[#FAFBFB] border border-[rgba(45,154,140,0.15)] rounded-lg focus:outline-none focus:border-[#2D9A8C] text-[#1A3A36] appearance-none"
              >
                {diagnoses.map((d) => (
                  <option key={d} value={d}>
                    {d === "all" ? "All Diagnoses" : d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#5A7470]">
          Showing {filteredPatients.length} of {mockPatients.length} patients
        </p>
      </div>

      {/* Patient Table/Cards */}
      <div className="space-y-3">
        {filteredPatients.map((patient) => (
          <Link
            key={patient.id}
            to={`/dashboard/patients/${patient.id}`}
            className="block"
          >
            <Card className="hover:shadow-md hover:border-[#2D9A8C] transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-12 gap-4 items-center">
                  {/* Patient Info */}
                  <div className="sm:col-span-3">
                    <h3 className="text-[#1A3A36] mb-1">{patient.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-[#5A7470]">
                      <Phone size={14} />
                      {patient.phone}
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="sm:col-span-3">
                    <p className="text-sm text-[#5A7470] mb-1">Diagnosis</p>
                    <p className="text-sm text-[#1A3A36]">{patient.diagnosis}</p>
                  </div>

                  {/* Last Call */}
                  <div className="sm:col-span-2">
                    <p className="text-sm text-[#5A7470] mb-1">Last Call</p>
                    <div className="flex items-center gap-1 text-sm text-[#1A3A36]">
                      <Calendar size={14} />
                      {new Date(patient.lastCallDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Doctor */}
                  <div className="sm:col-span-2">
                    <p className="text-sm text-[#5A7470] mb-1">Doctor</p>
                    <p className="text-sm text-[#1A3A36]">{patient.assignedDoctor}</p>
                  </div>

                  {/* Risk Level */}
                  <div className="sm:col-span-2 flex justify-end">
                    <Badge variant={patient.riskLevel}>{patient.riskLevel}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-[#5A7470]">No patients found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
