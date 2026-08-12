import { builds as initialBuilds } from "@/data/builds";
import { projects as initialProjects } from "@/data/projects";
import { reviews as initialReviews } from "@/data/reviews";
import { Build } from "@/types/build";
import { Project } from "@/types/project";
import { Review } from "@/types/review";

let builds: Build[] = structuredClone(initialBuilds);
let projects: Project[] = structuredClone(initialProjects);
let reviews: Review[] = structuredClone(initialReviews);

export function getBuilds(): Build[] {
  return builds;
}

export function getBuildById(id: string): Build | undefined {
  return builds.find((b) => b.id === id);
}

export function getBuildsByProject(projectId: string): Build[] {
  return builds
    .filter((b) => b.projectId === projectId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getReviews(): Review[] {
  return reviews;
}

export function getReviewsByBuild(buildId: string): Review[] {
  return reviews.filter((r) => r.buildId === buildId);
}

export function revertBuild(buildId: string): {
  success: boolean;
  message: string;
  activeBuild?: Build;
} {
  const target = builds.find((b) => b.id === buildId);
  if (!target) {
    return { success: false, message: "Build not found" };
  }

  const project = projects.find((p) => p.id === target.projectId);
  if (!project) {
    return { success: false, message: "Project not found" };
  }

  builds = builds.map((b) => {
    if (b.projectId !== target.projectId) return b;
    const isActive = b.id === buildId;
    return {
      ...b,
      isActive,
      status: isActive ? "Active" : b.status === "Active" ? "Approved" : b.status,
    };
  });

  projects = projects.map((p) =>
    p.id === target.projectId ? { ...p, activeBuildId: buildId } : p
  );

  const activeBuild = builds.find((b) => b.id === buildId);
  return {
    success: true,
    message: `Reverted to v${target.version}`,
    activeBuild,
  };
}

export function resetStore(): void {
  builds = structuredClone(initialBuilds);
  projects = structuredClone(initialProjects);
  reviews = structuredClone(initialReviews);
}
