import { Review } from "@/types/review";

export const reviews: Review[] = [
  {
    id: "rev-1",
    buildId: "build-ecotype-023",
    reviewer: "Sarah (Designer)",
    decision: "Pending",
    comment: "Need to test the new sorting mechanic flow.",
    createdAt: "2026-08-02",
  },
  {
    id: "rev-2",
    buildId: "build-ecotype-022",
    reviewer: "Sarah (Designer)",
    decision: "Approved",
    comment: "UI looks clean. Score screen bug is fixed.",
    createdAt: "2026-07-29",
  },
  {
    id: "rev-3",
    buildId: "build-farm-005",
    reviewer: "Sarah (Designer)",
    decision: "Pending",
    comment: "Checking crop planting UX on mobile.",
    createdAt: "2026-08-03",
  },
];
