import { describe, expect, it } from "vitest";
import {
  activities,
  activitiesInView,
  approvalPathEdgeIds,
  approvalPathNodeIds,
  batchActivityIds,
  departments,
  edges,
  edgesInView,
  getActivity,
  phases,
  walkthrough,
} from "./workflow";

describe("workflow graph", () => {
  it("includes every activity in the whole workflow", () => {
    expect(activitiesInView("all")).toHaveLength(activities.length);
    expect(activities.length).toBeGreaterThan(24);
  });

  it("gives each focused view a real subset", () => {
    const all = activitiesInView("all").length;
    for (const view of ["development", "order-materials", "production-shipment"] as const) {
      const count = activitiesInView(view).length;
      expect(count).toBeGreaterThan(8);
      expect(count).toBeLessThan(all);
    }
  });

  it("positions every activity in each view that shows it", () => {
    for (const activity of activities) {
      expect(activity.views).toContain("all");
      for (const view of activity.views) {
        expect(activity.positions[view], `${activity.id} ${view}`).toBeDefined();
      }
    }
  });

  it("connects edges only to known activities", () => {
    const ids = new Set(activities.map((activity) => activity.id));
    for (const edge of edges) {
      expect(ids.has(edge.source), edge.id).toBe(true);
      expect(ids.has(edge.target), edge.id).toBe(true);
    }
  });

  it("keeps focused views internally connected", () => {
    for (const view of ["all", "development", "order-materials", "production-shipment"] as const) {
      const present = new Set(activitiesInView(view).map((activity) => activity.id));
      for (const edge of edgesInView(view)) {
        expect(present.has(edge.source)).toBe(true);
        expect(present.has(edge.target)).toBe(true);
      }
    }
  });

  it("uses known departments and phases", () => {
    const phaseIds = new Set(phases.map((phase) => phase.id));
    for (const activity of activities) {
      expect(departments[activity.departmentId]).toBeDefined();
      expect(phaseIds.has(activity.phaseId)).toBe(true);
    }
  });

  it("keeps the production route on Sample Room and automatic order creation on Appstreme", () => {
    expect(getActivity("define-production-route").departmentId).toBe("sample-room");
    expect(getActivity("create-production-order").kind).toBe("automatic");
    expect(getActivity("create-production-order").departmentId).toBe("appstreme");
    expect(getActivity("calculate-requirements").kind).toBe("automatic");
  });

  it("keeps final inspection on the tracked production route", () => {
    const inspection = getActivity("final-inspection");
    expect(inspection.phaseId).toBe("route-tracking");
    expect(inspection.departmentId).toBe("production");
    const entry = getActivity("record-inspection-entry");
    expect(entry.dataEntered).toEqual([
      "Completed quantity",
      "First-quality quantity",
      "Second-quality quantity",
      "Defects",
    ]);
  });

  it("points the walkthrough, approval path and batch demo at real activities", () => {
    for (const step of walkthrough) {
      expect(step.body.length).toBeGreaterThan(20);
      for (const id of step.nodeIds) {
        expect(getActivity(id).id).toBe(id);
      }
    }
    for (const id of approvalPathNodeIds) expect(getActivity(id)).toBeDefined();
    for (const id of approvalPathEdgeIds) {
      expect(edges.some((edge) => edge.id === id)).toBe(true);
    }
    for (const id of batchActivityIds) expect(getActivity(id)).toBeDefined();
  });

  it("shows parallel development branches rather than a single sequence into costing", () => {
    const costingAfterComplete = edges.some(
      (edge) => edge.source === "complete-sample" && edge.target === "prepare-costing",
    );
    expect(costingAfterComplete).toBe(false);
    expect(getActivity("prepare-costing").parallelGroup).toBeTruthy();
    expect(getActivity("prep-without-fabric").parallelGroup).toBeTruthy();
    expect(getActivity("develop-fabric").parallelGroup).toBeTruthy();
  });
});
