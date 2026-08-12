export type ReviewDecision = "Approved" | "Rejected" | "Pending";

export interface Review {
  id: string;
  buildId: string;
  reviewer: string;
  decision: ReviewDecision;
  comment: string;
  createdAt: string;
}
