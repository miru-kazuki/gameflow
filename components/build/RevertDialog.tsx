"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Build } from "@/types/build";

interface RevertDialogProps {
  build: Build;
  currentActive?: Build;
  onNotify?: (type: "success" | "error" | "info", message: string) => void;
}

export default function RevertDialog({
  build,
  currentActive,
  onNotify,
}: RevertDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRevert() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/builds/${build.id}/revert`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.message ?? "Revert failed";
        setError(errorMessage);
        onNotify?.("error", errorMessage);
        return;
      }

      const successMessage = `Build v${build.version} berhasil diaktifkan.`;
      setOpen(false);
      onNotify?.("success", successMessage);
      router.refresh();
    } catch {
      const errorMessage = "Network error. Please try again.";
      setError(errorMessage);
      onNotify?.("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (build.isActive) return null;

  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Revert ke v{build.version}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
              <div>
                <h3 className="font-semibold">Revert Build?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Aktifkan build <strong>v{build.version}</strong> sebagai versi
                  live untuk {build.project}.
                  {currentActive && (
                    <>
                      {" "}
                      Build saat ini (v{currentActive.version}) akan dinonaktifkan.
                    </>
                  )}
                </p>
              </div>
            </div>

            {error && (
              <p className="mt-3 text-sm text-destructive">{error}</p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleRevert} disabled={loading}>
                {loading ? "Memproses..." : "Ya, Revert"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
