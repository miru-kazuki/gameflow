import { notFound } from "next/navigation";
import Link from "next/link";
import GamePlayer from "@/components/build/GamePlayer";
import RevertDialog from "@/components/build/RevertDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getBuildById,
  getBuilds,
  getReviewsByBuild,
} from "@/lib/store";
import { ArrowLeft, Play } from "lucide-react";

export default async function BuildDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const build = getBuildById(id);

  if (!build) notFound();

  const allBuilds = getBuilds();
  const active = allBuilds.find(
    (b) => b.projectId === build.projectId && b.isActive
  );
  const reviews = getReviewsByBuild(build.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/builds">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {build.project} — v{build.version}
            </h1>
            {build.isActive && <Badge>Live</Badge>}
          </div>
          <p className="text-muted-foreground">{build.commitMessage}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <GamePlayer
            buildPath={build.buildPath}
            title={`${build.project} v${build.version}`}
          />

          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/play/${build.id}`}>
                <Play className="mr-2 h-4 w-4" />
                Fullscreen Play
              </Link>
            </Button>
            <RevertDialog build={build} currentActive={active} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-background p-5">
            <h3 className="font-semibold">Build Info</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Version</dt>
                <dd className="font-medium">v{build.version}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Commit</dt>
                <dd className="font-mono">{build.commitHash.slice(0, 7)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Author</dt>
                <dd>{build.author}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>{build.isActive ? "Active" : build.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Date</dt>
                <dd>{build.createdAt}</dd>
              </div>
            </dl>
          </div>

          {reviews.length > 0 && (
            <div className="rounded-xl border bg-background p-5">
              <h3 className="font-semibold">Reviews</h3>
              <div className="mt-4 space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {review.reviewer}
                      </span>
                      <Badge
                        variant={
                          review.decision === "Approved"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {review.decision}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
