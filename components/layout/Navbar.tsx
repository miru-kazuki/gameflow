import NotificationBell from "@/components/notification/NotificationBell";

export default function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div />

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

