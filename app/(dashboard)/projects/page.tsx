import ProjectCard from "@/components/project/ProjectCard";
import { getBuilds, getProjects } from "@/lib/store";

export default function ProjectsPage() {
  const projects = getProjects();
  const builds = getBuilds();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="mt-1 text-muted-foreground">
          Game project yang terhubung ke repository GitHub.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const projectBuilds = builds.filter(
            (b) => b.projectId === project.id
          );
          const active = projectBuilds.find((b) => b.isActive);

          return (
            <ProjectCard
              key={project.id}
              project={project}
              buildCount={projectBuilds.length}
              activeVersion={active?.version}
            />
          );
        })}
      </div>
    </div>
  );
}
