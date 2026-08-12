import { notFound } from "next/navigation";
import Link from "next/link";
import GamePlayer from "@/components/build/GamePlayer";
import { Button } from "@/components/ui/button";
import { getBuildById } from "@/lib/store";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default async function PlayPage({
  params,
}: {
  params: Promise<{ buildId: string }>;
}) {
  const { buildId } = await params;
  const build = getBuildById(buildId);

  if (!build) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white shrink-0"
            asChild
          >
            <Link href={`/builds/${build.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold text-white text-sm sm:text-base">
              {build.project} — v{build.version}
            </h1>
            <p className="text-xs text-zinc-400 truncate max-w-[200px] sm:max-w-md">{build.commitMessage}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="border-zinc-700 text-zinc-300 w-full sm:w-auto justify-center"
          asChild
        >
          <Link href={`/builds/${build.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Build Detail
          </Link>
        </Button>
      </header>

      <main className="flex flex-1 items-center justify-center p-2 sm:p-6">
        <div className="w-full max-w-6xl">
          <GamePlayer
            buildPath={build.buildPath}
            title={`${build.project} v${build.version}`}
          />
        </div>
      </main>
    </div>
  );
}

