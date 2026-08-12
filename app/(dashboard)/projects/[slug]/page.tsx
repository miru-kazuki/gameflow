import { notFound } from "next/navigation";
import Link from "next/link";
import BuildCard from "@/components/build/BuildCard";
import SyncButton from "@/components/project/SyncButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getBuildsByProject,
  getBuilds,
  getProjectBySlug,
} from "@/lib/store";
import { ArrowLeft, GitBranch, Play } from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const builds = getBuildsByProject(project.id);
  const allBuilds = getBuilds();
  const activeBuild = builds.find((b) => b.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge variant="outline">{project.engine}</Badge>
            {activeBuild && <Badge>Live: v{activeBuild.version}</Badge>}
          </div>
          <p className="mt-2 text-muted-foreground">{project.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              {project.githubRepo}
            </span>
            <span>Branch: {project.githubBranch}</span>
            <span>Build folder: {project.buildFolder}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SyncButton project={project} />
        {activeBuild && (
          <Button asChild>
            <Link href={`/play/${activeBuild.id}`}>
              <Play className="mr-2 h-4 w-4" />
              Play Live Build
            </Link>
          </Button>
        )}
      </div>

      <section>
        <h2 className="text-xl font-semibold">
          Build History ({builds.length})
        </h2>
        <p className="text-sm text-muted-foreground">
          Versi terbaru di atas. Klik Revert untuk kembali ke versi sebelumnya.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {builds.map((build) => (
            <BuildCard
              key={build.id}
              build={build}
              currentActive={activeBuild}
              showProject={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
