"use client";

import Link from "next/link";
import { X, LayoutDashboard, Package, MessageSquare, FolderKanban, Settings } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menus = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Builds", href: "/builds", icon: Package },
  { name: "Reviews", href: "/reviews", icon: MessageSquare },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-full overflow-y-auto border-r bg-sidebar px-4 py-5 shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:static md:h-screen md:flex md:flex-col md:flex-shrink-0 md:w-64 md:max-w-none md:shadow-none md:translate-x-0`}
      >
        <div className="flex items-center justify-between border-b pb-4 md:pb-5">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tight">
              GameFlow
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">Build Management</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-5 flex flex-1 flex-col gap-2">
          {menus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={onClose}
            >
              <menu.icon className="h-4 w-4" />
              {menu.name}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t pt-4">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <p className="text-xs font-medium">Role</p>
            <p className="text-sm text-muted-foreground">Designer / Programmer</p>
          </div>
        </div>
      </aside>
    </>
  );
}
