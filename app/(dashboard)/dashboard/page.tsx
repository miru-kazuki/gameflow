"use client";

import { useState } from "react";
import BuildCard from "@/components/build/BuildCard";
import { getBuilds, getProjects, getReviews } from "@/lib/store";
import { Package, FolderKanban, MessageSquare, Zap, CheckCircle2, XCircle, Info } from "lucide-react";
import SyncButton from "@/components/project/SyncButton";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

export default function DashboardPage() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const builds = getBuilds();
  const projects = getProjects();
  const reviews = getReviews();
  const pendingReviews = reviews.filter((r) => r.decision === "Pending");
  const activeBuilds = builds.filter((b) => b.isActive);

  const notify = (type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  // Ambil proyek utama (misal: Deck Recycle) untuk target tombol sync
  const currentProject = projects[0];

  const recentBuilds = [...builds]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      icon: FolderKanban,
      color: "text-blue-600",
    },
    {
      label: "Total Builds",
      value: builds.length,
      icon: Package,
      color: "text-emerald-600",
    },
    {
      label: "Live Builds",
      value: activeBuilds.length,
      icon: Zap,
      color: "text-amber-600",
    },
    {
      label: "Pending Reviews",
      value: pendingReviews.length,
      icon: MessageSquare,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Dashboard & Tombol Sync */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola, test, dan review build game Anda.
          </p>
        </div>
        {currentProject && (
          <SyncButton project={currentProject} onNotify={notify} />
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-background p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Build Terbaru</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {recentBuilds.map((build) => {
            const active = builds.find(
              (b) => b.projectId === build.projectId && b.isActive
            );
            return (
              <BuildCard
                key={build.id}
                build={build}
                currentActive={active}
                onNotify={notify}
              />
            );
          })}
        </div>
      </section>

      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => {
          const iconMap = {
            success: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
            error: <XCircle className="h-5 w-5 text-red-600" />,
            info: <Info className="h-5 w-5 text-blue-600" />,
          };

          const toneMap = {
            success: "border-emerald-200 bg-emerald-50 text-emerald-900",
            error: "border-red-200 bg-red-50 text-red-900",
            info: "border-blue-200 bg-blue-50 text-blue-900",
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-lg ${toneMap[toast.type]}`}
              role="status"
              aria-live="polite"
            >
              <div className="mt-0.5">{iconMap[toast.type]}</div>
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}