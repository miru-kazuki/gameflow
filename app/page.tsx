import Link from "next/link";
import {
  ArrowRight,
  GitBranch,
  Gamepad2,
  RotateCcw,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: GitBranch,
    title: "Version Control dari GitHub",
    description:
      "Otomatis ambil build Unity/Godot WebGL dari repository GitHub tim Anda.",
  },
  {
    icon: Gamepad2,
    title: "Mainkan Langsung di Browser",
    description:
      "Designer dan programmer bisa test game tanpa install engine — langsung di browser.",
  },
  {
    icon: RotateCcw,
    title: "Revert ke Versi Sebelumnya",
    description:
      "Build rusak? Revert ke versi stabil sebelumnya dengan satu klik.",
  },
  {
    icon: Users,
    title: "Jembatan Designer ↔ Programmer",
    description:
      "Review build, beri feedback, dan track status approval setiap versi.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight">GameFlow</span>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Button asChild>
              <Link href="/dashboard">
                Mulai
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <div className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
            Version Control untuk Game Development
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Jembatan antara
            <br />
            <span className="text-blue-600">Designer</span> &{" "}
            <span className="text-emerald-600">Programmer</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            GameFlow mengambil build game Unity/Godot dari GitHub, menampilkannya
            di browser, dan memungkinkan tim Anda review, test, dan revert versi
            dengan mudah.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Buka Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/projects">Lihat Projects</Link>
            </Button>
          </div>
        </section>

        <section className="border-t bg-white py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border p-6">
                <feature.icon className="h-8 w-8 text-blue-600" />
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold">Cara Kerja</h2>
            <ol className="mt-8 space-y-6 text-left">
              {[
                "Programmer push build WebGL/HTML5 ke folder di GitHub repo",
                "GameFlow sync commit terbaru dan deteksi build folder",
                "Designer buka dashboard, play game langsung di browser",
                "Review & approve — atau revert ke versi sebelumnya jika perlu",
              ].map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-muted-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        GameFlow — Game Build Management Platform
      </footer>
    </div>
  );
}
