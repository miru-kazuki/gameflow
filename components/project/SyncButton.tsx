"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/types/project";
import { fetchSyncWithProgress, SyncProgressUpdate } from "@/lib/sync/syncStream";

interface SyncButtonProps {
  project: Project;
  onNotify?: (type: "success" | "error" | "info", message: string) => void;
}

export default function SyncButton({ project, onNotify }: SyncButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [stage, setStage] = useState<string>("");
  const [result, setResult] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  async function handleSync() {
    setLoading(true);
    setResult(null);
    setProgress(5);
    setStage("Menghubungkan ke Supabase Storage...");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetchSyncWithProgress({
        repo: project.githubRepo,
        signal: controller.signal,
        onProgress: (update: SyncProgressUpdate) => {
          setProgress(update.percent);
          setStage(update.stage);
        },
      });

      if (res.cancelled) {
        setResult({ type: "info", message: "Sync dibatalkan oleh pengguna." });
        onNotify?.("info", "Sync dibatalkan");
      } else if (res.success) {
        const successMessage = res.message || "Game berhasil disinkronkan ke web!";
        setResult({ type: "success", message: successMessage });
        onNotify?.("success", successMessage);
        router.refresh();
      }
    } catch (err: any) {
      const errorMessage = err.message || "Sync gagal";
      setResult({ type: "error", message: errorMessage });
      onNotify?.("error", errorMessage);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
      setTimeout(() => {
        setProgress(null);
        setStage("");
      }, 3500);
    }
  }

  function handleCancel() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }

  return (
    <div className="flex flex-col gap-2.5 max-w-md w-full sm:w-auto">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={handleSync}
          disabled={loading}
          className="relative overflow-hidden transition-all shadow-sm hover:shadow"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span>Syncing...</span>
              {progress !== null && (
                <span className="rounded bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                  {Math.round(progress)}%
                </span>
              )}
            </span>
          ) : (
            "Sync Build Game"
          )}
        </Button>

        {result && (
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {result.type === "success" ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                {result.message}
              </span>
            ) : result.type === "info" ? (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Info className="h-4 w-4" />
                {result.message}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                {result.message}
              </span>
            )}
          </div>
        )}
      </div>

      {loading && progress !== null && (
        <div className="w-full rounded-lg border border-blue-100 bg-blue-50/50 p-2.5 dark:border-blue-900/50 dark:bg-blue-950/20 animate-in fade-in duration-200">
          <Progress
            value={progress}
            showValue={true}
            statusText={stage}
            size="md"
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}