"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type?: "build" | "sync" | "info";
  project?: string;
  version?: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  activeToast: AppNotification | null;
  addNotification: (notification: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  dismissToast: () => void;
  triggerSimulatedBuildUpdate: () => Promise<{ success: boolean; message: string }>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-init-1",
    title: "Selamat datang di GameFlow",
    message: "Sistem notifikasi Supabase Realtime aktif dan siap mendeteksi update build baru.",
    timestamp: "Baru saja",
    read: false,
    type: "info",
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  const addNotification = useCallback(
    (notif: Omit<AppNotification, "id" | "timestamp" | "read">) => {
      const newNotif: AppNotification = {
        ...notif,
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };

      setNotifications((prev) => [newNotif, ...prev]);
      setActiveToast(newNotif);
    },
    []
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const triggerSimulatedBuildUpdate = useCallback(async () => {
    try {
      const res = await fetch("/api/builds/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: "Deck Recycle",
          version: `0.${Math.floor(Math.random() * 10 + 13)}.0`,
          fileName: "deck-recycle/latest.zip",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memicu update Supabase");
      }

      return {
        success: true,
        message: data.message || "Simulasi upload file build ke Supabase berhasil!",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Gagal memicu update Supabase",
      };
    }
  }, []);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase credentials environment variable missing.");
      return;
    }

    const supabase = createClient();

    // 1. Subscribe to Supabase Realtime Channel (Broadcast events)
    const channel = supabase
      .channel("gameflow-builds")
      .on("broadcast", { event: "new-build" }, (payload) => {
        const buildInfo = payload.payload;
        addNotification({
          title: "🚀 Build Baru di Supabase!",
          message: `File build "${buildInfo?.fileName || "latest.zip"}" untuk ${buildInfo?.project || "Game"} telah ter-update di Supabase Storage.`,
          type: "build",
          project: buildInfo?.project,
          version: buildInfo?.version,
        });
      })
      // 2. Subscribe to Postgres Changes on Supabase Storage objects table (if available)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "storage",
          table: "objects",
        },
        (payload) => {
          const record = payload.new as any;
          const fileName = record?.name || "build.zip";
          addNotification({
            title: "⚡ File Supabase Ter-update!",
            message: `File "${fileName}" di bucket storage Supabase telah diperbarui. Ada build baru tersedia!`,
            type: "build",
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Terhubung ke Supabase Realtime channel gameflow-builds");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addNotification]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToast,
        addNotification,
        markAllAsRead,
        markAsRead,
        clearNotifications,
        dismissToast,
        triggerSimulatedBuildUpdate,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
