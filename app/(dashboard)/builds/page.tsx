import BuildCard from "@/components/build/BuildCard";
import { getBuilds } from "@/lib/store";

export default function BuildsPage() {
  const builds = getBuilds().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold">Builds</h1>
        <p className="mt-1 text-muted-foreground">
          Semua build game dari repository GitHub.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {builds.map((build) => {
          const active = builds.find(
            (b) => b.projectId === build.projectId && b.isActive
          );
          return (
            <BuildCard
              key={build.id}
              build={build}
              currentActive={active}
            />
          );
        })}
      </div>
    </div>
  );
}
