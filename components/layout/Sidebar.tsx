import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  FolderKanban,
  Settings,
} from "lucide-react";

const menus = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Builds", href: "/builds", icon: Package },
  { name: "Reviews", href: "/reviews", icon: MessageSquare },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex w-64 min-h-screen flex-col border-r bg-sidebar">
      <div className="border-b p-5">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          GameFlow
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">Build Management</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <menu.icon className="h-4 w-4" />
            {menu.name}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <p className="text-xs font-medium">Role</p>
          <p className="text-sm text-muted-foreground">Designer / Programmer</p>
        </div>
      </div>
    </aside>
  );
}
