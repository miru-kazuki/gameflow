export type GameEngine = "Unity" | "Godot";

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  engine: GameEngine;
  githubRepo: string;
  githubBranch: string;
  buildFolder: string;
  activeBuildId: string;
  createdAt: string;
}
