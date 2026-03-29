import { useState, useRef } from "react";
import { fetchWithAuth } from "../../lib/api";
import { X, Upload } from "lucide-react";
import Papa from "papaparse";
import { read, utils } from "xlsx";

interface ImportPatientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportPatientsModal({
  isOpen,
  onClose,
  onSuccess,
}: ImportPatientsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    try {
      const fileName = file.name.toLowerCase();
      const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
      const isCsv = fileName.endsWith(".csv");

      if (!isExcel && !isCsv) {
        throw new Error("Please upload a CSV or Excel file.");
      }

      let parsedData: any[] = [];

      if (isCsv) {
        parsedData = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (err) => reject(new Error(err.message)),
          });
        });
      } else {
        const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
          reader.onerror = (e) =>
            reject(new Error("Failed to read the excel file."));
          reader.readAsArrayBuffer(file);
        });
        const workbook = read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        parsedData = utils.sheet_to_json(worksheet);
      }

      if (parsedData.length === 0) {
        throw new Error("The uploaded file is empty.");
      }

      // Map rows and add
      setProgress({ current: 0, total: parsedData.length });
      let successCount = 0;
      let errorCount = 0;

      for (const [index, row] of parsedData.entries()) {
        const getStr = (keys: string[], defaultVal = "") => {
          for (const key of keys) {
            const foundKey = Object.keys(row).find(
              (k) => k.toLowerCase().trim() === key.toLowerCase().trim(),
            );
            if (
              foundKey &&
              row[foundKey] !== undefined &&
              row[foundKey] !== null
            ) {
              return String(row[foundKey]).trim();
            }
          }
          return defaultVal;
        };

        const payload = {
          name: getStr([
            "name",
            "patient name",
            "full name",
            "first name",
            "patient_name",
          ]),
          phone_number: getStr([
            "phone",
            "phone_number",
            "phone number",
            "mobile",
            "contact",
            "mobile number",
            "phone_no",
            "phone no",
          ]),
          language_preference: getStr(
            ["language", "language_preference", "language preference", "lang"],
            "English",
          ),
          primary_diagnosis: getStr([
            "diagnosis",
            "primary_diagnosis",
            "primary diagnosis",
            "condition",
            "reason",
          ]),
          flow_type: getStr(
            [
              "flow",
              "flow_type",
              "flow type",
              "journey flow",
              "type",
              "category",
              "journey",
            ],
            "Screening",
          ),
        };

        if (!payload.name || !payload.phone_number) {
          console.warn("Skipped row due to missing name or phone:", row);
          errorCount++;
          continue;
        }

        try {
          await fetchWithAuth("/patients", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          successCount++;
        } catch (err) {
          console.error(`Error adding patient ${payload.name}`, err);
          errorCount++;
        }

        setProgress({
          current: Math.min(index + 1, parsedData.length),
          total: parsedData.length,
        });
      }

      if (successCount > 0) {
        onSuccess();
        if (errorCount > 0) {
          setError(
            `Import completed: ${successCount} added, ${errorCount} skipped (duplicates or missing data).`,
          );
        } else {
          onClose(); // Close perfectly if no errors
        }
      } else {
        if (errorCount > 0) {
          setError(
            `Failed to import. All ${errorCount} rows were skipped. They might be duplicates (same phone number) or missing required columns like Name/Phone.`,
          );
        } else {
          throw new Error(
            "No data found to import. Please check if the file format is correct.",
          );
        }
      }
    } catch (err: any) {
      console.error("Import error:", err);
      setError(err.message || "Failed to import the file.");
    } finally {
      setLoading(false);
      setProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl text-primary mb-6">Import Patients</h2>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a CSV or Excel file containing patient records. The file
            should have headers matching: <br />
            <strong>
              Name, Phone Number, Language Preference, Primary Diagnosis,
              Journey Flow
            </strong>
          </p>

          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => !loading && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Click to select a CSV or Excel file
            </p>
          </div>

          {progress && (
            <div className="text-sm text-center text-primary font-medium">
              Uploading: {progress.current} / {progress.total}
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg">
              {error}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-secondary/50 transition-colors disabled:opacity-50"
            >
              {error && !loading ? "Close" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
