import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
} from "lucide-react";
import { getRiskBadgeClass, RiskLevel, Patient } from "../data/mockData";
import { fetchWithAuth } from "../../lib/api";
import { AddPatientModal } from "../components/AddPatientModal";
import { ImportPatientsModal } from "../components/ImportPatientsModal";
import { EditDiagnosisModal } from "../components/EditDiagnosisModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | "all">("all");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "riskLevel";
    direction: "asc" | "desc";
  } | null>(null);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth("/patients");
      // Map backend real data to frontend expected model
      const realPatients: Patient[] = res.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        age: 0, // Not provided by current backend model
        phone: p.phone_number,
        language: p.language_preference || "Hindi",
        diagnosis: p.primary_diagnosis || "General",
        diagnosisCode: p.primary_diagnosis || "General",
        dischargeDate: p.created_at,
        assignedDoctorId: "N/A",
        lastCallDate: p.created_at,
        riskLevel:
          p.call_logs &&
          p.call_logs.length > 0 &&
          p.call_logs[0].risk_classification
            ? p.call_logs[0].risk_classification.toLowerCase()
            : "low",
        riskScore:
          p.call_logs &&
          p.call_logs.length > 0 &&
          p.call_logs[0].risk_classification
            ? p.call_logs[0].risk_classification.toLowerCase() === "critical"
              ? 0.95
              : p.call_logs[0].risk_classification.toLowerCase() === "high"
                ? 0.85
                : p.call_logs[0].risk_classification.toLowerCase() === "medium"
                  ? 0.6
                  : 0.3
            : 0.3,
      }));
      setPatients(realPatients);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await fetchWithAuth(`/patients/${id}`, { method: "DELETE" });
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setDeletePatientId(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete patient");
    }
  };

  const updateDiagnosis = async (id: string, diagnosis: string) => {
    try {
      await fetchWithAuth(`/patients/${id}/diagnosis`, {
        method: "PATCH",
        body: JSON.stringify({ diagnosis }),
      });
      setPatients((prev) =>
        prev.map((p) => (p.id === id ? { ...p, diagnosis } : p)),
      );
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // Get unique diagnoses
  const diagnoses = useMemo(
    () => Array.from(new Set(patients.map((p) => p.diagnosisCode))),
    [patients],
  );

  const handleSort = (key: "name" | "riskLevel") => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort patients
  const filteredPatients = useMemo(() => {
    return patients
      .filter((patient) => {
        const matchesSearch =
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.phone.includes(searchQuery);
        const matchesRisk =
          selectedRisk === "all" || patient.riskLevel === selectedRisk;
        const matchesDiagnosis =
          selectedDiagnosis === "all" ||
          patient.diagnosisCode === selectedDiagnosis;
        return matchesSearch && matchesRisk && matchesDiagnosis;
      })
      .sort((a, b) => {
        if (sortConfig) {
          if (sortConfig.key === "name") {
            const comparison = a.name.localeCompare(b.name);
            return sortConfig.direction === "asc" ? comparison : -comparison;
          }
          if (sortConfig.key === "riskLevel") {
            const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            const comparison = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
            return sortConfig.direction === "asc" ? comparison : -comparison;
          }
        }
        // Default sort by risk level (critical first)
        const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      });
  }, [patients, searchQuery, selectedRisk, selectedDiagnosis, sortConfig]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-2 text-primary">Patients</h1>
          <p className="text-muted-foreground">
            Manage and monitor all discharged patients
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-sm hover:bg-secondary/80 transition border border-border"
          >
            Import
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-sm hover:bg-primary/90 transition"
          >
            <Plus className="w-5 h-5" />
            Add Patient
          </button>
        </div>
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
              onChange={(e) =>
                setSelectedRisk(e.target.value as RiskLevel | "all")
              }
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
              {diagnoses.map((diagnosis) => (
                <option key={diagnosis} value={diagnosis}>
                  {diagnosis}
                </option>
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
                <th
                  className="px-6 py-4 text-left text-sm text-secondary-foreground cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortConfig?.key === "name" ? (
                      sortConfig.direction === "asc" ? (
                        <ArrowUp className="w-4 h-4 text-primary" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">
                  Diagnosis
                </th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">
                  Last Call
                </th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">
                  Risk Level
                </th>
                <th className="px-6 py-4 text-left text-sm text-secondary-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-primary font-medium">
                        {patient.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm">{patient.diagnosis}</div>
                      <div className="text-xs text-muted-foreground">
                        {patient.language}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(patient.lastCallDate).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${getRiskBadgeClass(patient.riskLevel)}`}
                      >
                        {patient.riskLevel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/dashboard/patients/${patient.id}`}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => setEditPatient(patient)}
                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                        title="Edit Diagnosis"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletePatientId(patient.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors p-1"
                        title="Delete Patient"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
        Showing {filteredPatients.length} of {patients.length} patients
      </div>

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadPatients}
      />
      <ImportPatientsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={loadPatients}
      />

      <EditDiagnosisModal
        isOpen={!!editPatient}
        onClose={() => setEditPatient(null)}
        onSuccess={loadPatients}
        patient={editPatient}
        updateDiagnosis={updateDiagnosis}
      />

      <AlertDialog
        open={!!deletePatientId}
        onOpenChange={(open) => !open && setDeletePatientId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              patient record and all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletePatientId && deletePatient(deletePatientId)}
            >
              Delete Patient
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
