import { GitBranch, Key, FolderOpen } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Konfigurasi integrasi GitHub dan build folder.
        </p>
      </section>

      <section className="space-y-6">
        <div className="rounded-xl border bg-background p-6">
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5" />
            <h2 className="font-semibold">GitHub Integration</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Hubungkan GitHub token untuk sync commit dan build otomatis dari
            repository.
          </p>
          <div className="mt-4 space-y-3">
            <label className="text-sm font-medium">GitHub Personal Access Token</label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Set environment variable{" "}
              <code className="rounded bg-muted px-1">GITHUB_TOKEN</code> di{" "}
              <code className="rounded bg-muted px-1">.env.local</code>
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-6">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-5 w-5" />
            <h2 className="font-semibold">Build Folder Convention</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            GameFlow mencari build WebGL/HTML5 di folder berikut di repo GitHub:
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="rounded-lg bg-muted px-3 py-2 font-mono">
              Unity: Builds/WebGL/
            </li>
            <li className="rounded-lg bg-muted px-3 py-2 font-mono">
              Godot: builds/html5/
            </li>
          </ul>
        </div>

        <div className="rounded-xl border bg-background p-6">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5" />
            <h2 className="font-semibold">Workflow CI/CD</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Push build ke GitHub → GameFlow sync → Designer review → Approve atau
            Revert.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs text-green-400">
{`# .github/workflows/build.yml
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Unity WebGL
        run: unity-builder ...
      - name: Push build folder
        run: git add Builds/WebGL && git commit && git push`}
          </pre>
        </div>
      </section>
    </div>
  );
}
