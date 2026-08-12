"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, X, Sparkles } from "lucide-react";
import { useNotifications } from "./NotificationContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchSyncWithProgress, SyncProgressUpdate } from "@/lib/sync/syncStream";

export default function NotificationToast() {
  const router = useRouter();
  const { activeToast, dismissToast, addNotification } = useNotifications();
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<number | null>(null);
  const [syncStage, setSyncStage] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  if (!activeToast) return null;

  async function handleSync() {
    setSyncing(true);
    setSyncProgress(5);
    setSyncStage("Menghubungkan ke Supabase Storage...");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetchSyncWithProgress({
        repo: "gameflow-builds",
        signal: controller.signal,
        onProgress: (update: SyncProgressUpdate) => {
          setSyncProgress(update.percent);
          setSyncStage(update.stage);
        },
      });

      if (res.cancelled) {
        addNotification({
          title: "ℹ️ Sync Dibatalkan",
          message: "Proses sync build dibatalkan oleh pengguna.",
          type: "info",
        });
        setSyncing(false);
        setSyncProgress(null);
      } else if (res.success) {
        addNotification({
          title: "✅ Sync Build Berhasil",
          message: res.message || "Game build terbaru telah disinkronkan ke GameFlow!",
          type: "sync",
        });
        router.refresh();
        setTimeout(() => {
          setSyncing(false);
          dismissToast();
        }, 1200);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      addNotification({
        title: "❌ Sync Gagal",
        message: message || "Gagal melakukan sync build.",
        type: "info",
      });
      setSyncing(false);
      setSyncProgress(null);
    } finally {
      abortControllerRef.current = null;
    }
  }

  function handleCancel() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-blue-900 dark:bg-zinc-900/95">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />
        
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                Supabase Update
              </span>
              <span className="text-xs text-muted-foreground">{activeToast.timestamp}</span>
            </div>

            <h4 className="mt-1 text-sm font-bold text-foreground">
              {activeToast.title}
            </h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {activeToast.message}
            </p>

            {/* Progress Bar ketika Sync sedang berjalan */}
            {syncing && syncProgress !== null && (
              <div className="mt-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 p-2.5 border border-blue-100 dark:border-blue-900/50 animate-in fade-in duration-200">
                <Progress
                  value={syncProgress}
                  showValue={true}
                  statusText={syncStage}
                  size="sm"
                  onCancel={handleCancel}
                />
              </div>
            )}

            {!syncing && (
              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-8 bg-blue-600 hover:bg-blue-700 text-xs text-white shadow-sm"
                  onClick={handleSync}
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Sync Build Sekarang
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  onClick={dismissToast}
                >
                  Nanti
                </Button>
              </div>
            )}
          </div>

          <button
            onClick={dismissToast}
            disabled={syncing}
            className="absolute top-3 right-3 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            aria-label="Tutup Notifikasi"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
