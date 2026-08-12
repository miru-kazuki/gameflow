import Link from "next/link";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { GitBranch, Gamepad2, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  buildCount: number;
  activeVersion?: string;
}

export default function ProjectCard({
  project,
  buildCount,
  activeVersion,
}: ProjectCardProps) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{project.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.description}
            </p>
          </div>
          <Badge variant="outline">{project.engine}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <span>{project.githubRepo}</span>
        </div>
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          <span>
            {buildCount} builds
            {activeVersion && (
              <span className="text-muted-foreground">
                {" "}
                · Live: v{activeVersion}
              </span>
            )}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Build folder: {project.buildFolder}
        </p>
      </CardContent>

      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/projects/${project.slug}`}>
            Lihat Project
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
