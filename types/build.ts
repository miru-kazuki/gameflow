export type BuildStatus =
  | "Waiting Review"
  | "Approved"
  | "Rejected"
  | "Active";

export interface Build {
  id: string;
  projectId: string;
  project: string;
  version: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  status: BuildStatus;
  buildPath: string;
  createdAt: string;
  isActive: boolean;
}
