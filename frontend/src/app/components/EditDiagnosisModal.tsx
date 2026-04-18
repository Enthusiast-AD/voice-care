import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/Button";

interface EditDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patient: {
    id: string;
    name: string;
    diagnosis: string;
  } | null;
  updateDiagnosis: (id: string, diagnosis: string) => Promise<void>;
}

export function EditDiagnosisModal({
  isOpen,
  onClose,
  onSuccess,
  patient,
  updateDiagnosis,
}: EditDiagnosisModalProps) {
  const [diagnosis, setDiagnosis] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patient) {
      setDiagnosis(patient.diagnosis);
    }
  }, [patient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    try {
      setIsSubmitting(true);
      await updateDiagnosis(patient.id, diagnosis);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update diagnosis:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Diagnosis</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Patient Name</label>
            <div className="p-2 bg-secondary rounded-md text-secondary-foreground">
              {patient?.name}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="diagnosis" className="text-sm font-medium">
              Primary Diagnosis
            </label>
            <input
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full p-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || diagnosis === patient?.diagnosis}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
