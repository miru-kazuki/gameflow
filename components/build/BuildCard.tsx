import Link from "next/link";
import { Build } from "@/types/build";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import RevertDialog from "@/components/build/RevertDialog";
import {
  FolderGit2,
  GitCommitHorizontal,
  User,
  Play,
  MessageSquare,
  Calendar,
  Zap,
} from "lucide-react";

interface BuildCardProps {
  build: Build;
  currentActive?: Build;
  showProject?: boolean;
  onNotify?: (type: "success" | "error" | "info", message: string) => void;
}

const statusStyle: Record<string, string> = {
  "Waiting Review":
    "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100",
  Approved:
    "bg-green-100 text-green-800 border-green-300 hover:bg-green-100",
  Rejected: "bg-red-100 text-red-800 border-red-300 hover:bg-red-100",
  Active: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100",
};

export default function BuildCard({
  build,
  currentActive,
  showProject = true,
  onNotify,
}: BuildCardProps) {
  const status = build.isActive ? "Active" : build.status;

  return (
    <Card
      className={`transition-all hover:shadow-lg ${
        build.isActive ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          {showProject && (
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {build.project}
            </p>
          )}
          <h2 className="text-lg font-semibold">v{build.version}</h2>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {build.commitMessage}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <Badge className={statusStyle[status]}>{status}</Badge>
          {build.isActive && (
            <span className="flex items-center gap-1 text-xs text-blue-600">
              <Zap className="h-3 w-3" /> Live
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <GitCommitHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Commit</span>
          <span className="ml-auto font-mono">{build.commitHash.slice(0, 7)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Author</span>
          <span className="ml-auto">{build.author}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Date</span>
          <span className="ml-auto">{build.createdAt}</span>
        </div>

        {showProject && (
          <div className="flex items-center gap-2 text-sm">
            <FolderGit2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Engine Build</span>
            <span className="ml-auto truncate text-xs text-muted-foreground">
              {build.buildPath}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button className="flex-1" asChild>
          <Link href={`/play/${build.id}`}>
            <Play className="mr-2 h-4 w-4" />
            Play
          </Link>
        </Button>

        <Button variant="secondary" className="flex-1" asChild>
          <Link href={`/builds/${build.id}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Detail
          </Link>
        </Button>

        <RevertDialog
          build={build}
          currentActive={currentActive}
          onNotify={onNotify}
        />
      </CardFooter>
    </Card>
  );
}
