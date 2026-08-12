import Link from "next/link";
import { getBuilds, getReviews } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Play } from "lucide-react";

export default function ReviewsPage() {
  const reviews = getReviews();
  const builds = getBuilds();

  const pending = reviews.filter((r) => r.decision === "Pending");
  const completed = reviews.filter((r) => r.decision !== "Pending");

  function ReviewItem({ reviewId }: { reviewId: string }) {
    const review = reviews.find((r) => r.id === reviewId)!;
    const build = builds.find((b) => b.id === review.buildId);

    if (!build) return null;

    return (
      <div className="rounded-xl border bg-background p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">
              {build.project} — v{build.version}
            </h3>
            <p className="text-sm text-muted-foreground">
              {review.reviewer} · {review.createdAt}
            </p>
          </div>
          <Badge
            variant={
              review.decision === "Approved"
                ? "default"
                : review.decision === "Rejected"
                  ? "destructive"
                  : "secondary"
            }
          >
            {review.decision}
          </Badge>
        </div>

        <p className="mt-3 text-sm">{review.comment}</p>

        <div className="mt-4 flex gap-2">
          <Button size="sm" asChild>
            <Link href={`/play/${build.id}`}>
              <Play className="mr-2 h-3 w-3" />
              Play & Review
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/builds/${build.id}`}>Detail</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="mt-1 text-muted-foreground">
          Feedback dari designer untuk setiap build.
        </p>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <MessageSquare className="h-5 w-5" />
          Pending ({pending.length})
        </h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {pending.length === 0 ? (
            <p className="text-muted-foreground">Tidak ada review pending.</p>
          ) : (
            pending.map((r) => <ReviewItem key={r.id} reviewId={r.id} />)
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          Selesai ({completed.length})
        </h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {completed.map((r) => (
            <ReviewItem key={r.id} reviewId={r.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
