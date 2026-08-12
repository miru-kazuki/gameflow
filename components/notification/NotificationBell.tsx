"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Trash2,
  Sparkles,
  RefreshCw,
  Package,
  Info,
  CheckCheck,
} from "lucide-react";
import { useNotifications } from "./NotificationContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchSyncWithProgress, SyncProgressUpdate } from "@/lib/sync/syncStream";

export default function NotificationBell() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    clearNotifications,
    triggerSimulatedBuildUpdate,
    addNotification,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<{ [notifId: string]: { percent: number; stage: string } }>({});
  const abortControllersRef = useRef<{ [notifId: string]: AbortController }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSimulate() {
    setSimulating(true);
    await triggerSimulatedBuildUpdate();
    setSimulating(false);
  }

  async function handleSync(notifId: string) {
    setSyncingId(notifId);
    setSyncState((prev) => ({
      ...prev,
      [notifId]: { percent: 5, stage: "Menghubungkan ke Supabase Storage..." },
    }));

    const controller = new AbortController();
    abortControllersRef.current[notifId] = controller;

    try {
      const res = await fetchSyncWithProgress({
        repo: "gameflow-builds",
        signal: controller.signal,
        onProgress: (update: SyncProgressUpdate) => {
          setSyncState((prev) => ({
            ...prev,
            [notifId]: { percent: update.percent, stage: update.stage },
          }));
        },
      });

      if (res.cancelled) {
        addNotification({
          title: "ℹ️ Sync Dibatalkan",
          message: "Proses sync build dibatalkan oleh pengguna.",
          type: "info",
        });
      } else if (res.success) {
        addNotification({
          title: "✅ Sync Berhasil",
          message: res.message || "Game build terbaru dari Supabase telah diterapkan!",
          type: "sync",
        });
        markAsRead(notifId);
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      delete abortControllersRef.current[notifId];
      setTimeout(() => {
        setSyncingId(null);
        setSyncState((prev) => {
          const next = { ...prev };
          delete next[notifId];
          return next;
        });
      }, 1200);
    }
  }

  function handleCancel(notifId: string) {
    if (abortControllersRef.current[notifId]) {
      abortControllersRef.current[notifId].abort();
      delete abortControllersRef.current[notifId];
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-label="Buka Notifikasi"
      >
        <Bell className="h-5 w-5 text-muted-foreground transition-transform hover:scale-105" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-zinc-200 bg-white shadow-2xl z-50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3 bg-zinc-50/50 dark:bg-zinc-800/50">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Notifikasi Build</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  {unreadCount} baru
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600 transition-colors"
                title="Tandai semua dibaca"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tandai dibaca</span>
              </button>
            )}
          </div>

          {/* Test Trigger Action Bar */}
          <div className="border-b bg-blue-50/60 dark:bg-blue-950/30 p-2 px-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSimulate}
              disabled={simulating}
              className="w-full h-8 text-xs border-blue-200 bg-white hover:bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-zinc-900 dark:text-blue-300 dark:hover:bg-blue-900/30"
            >
              <Sparkles className={`mr-1.5 h-3.5 w-3.5 ${simulating ? "animate-spin" : ""}`} />
              {simulating ? "Mengirim sinyal Supabase..." : "⚡ Simulasi Build Supabase Ter-update"}
            </Button>
          </div>

          {/* List Notifikasi */}
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                <p className="mt-2 text-xs">Belum ada notifikasi.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3.5 transition-colors cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/60 ${
                    !notif.read ? "bg-blue-50/30 dark:bg-blue-950/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        notif.type === "build"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          : notif.type === "sync"
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {notif.type === "build" ? (
                        <Package className="h-4 w-4" />
                      ) : notif.type === "sync" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs font-semibold truncate ${
                            !notif.read ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>

                      {notif.type === "build" && (
                        <div className="mt-2 space-y-2">
                          {syncingId === notif.id && syncState[notif.id] ? (
                            <div className="rounded-lg bg-blue-50/80 p-2 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/50">
                              <Progress
                                value={syncState[notif.id].percent}
                                showValue={true}
                                statusText={syncState[notif.id].stage}
                                size="sm"
                                onCancel={() => handleCancel(notif.id)}
                              />
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSync(notif.id);
                              }}
                              disabled={syncingId === notif.id}
                              className="h-7 text-[11px] px-2.5 bg-blue-600 text-white hover:bg-blue-700"
                            >
                              <RefreshCw
                                className={`mr-1 h-3 w-3 ${
                                  syncingId === notif.id ? "animate-spin" : ""
                                }`}
                              />
                              Sync Sekarang
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {!notif.read && (
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between border-t px-4 py-2 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-muted-foreground">
              <span>{notifications.length} total notifikasi</span>
              <button
                onClick={clearNotifications}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Hapus
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
