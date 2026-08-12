"use client";

import { Menu } from "lucide-react";
import NotificationBell from "@/components/notification/NotificationBell";

interface NavbarProps {
  onOpenSidebar: () => void;
}

export default function Navbar({ onOpenSidebar }: NavbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
            N
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">Nabil</p>
            <p className="text-xs text-muted-foreground">Programmer</p>
          </div>
        </div>
      </div>
    </header>
  );
}

