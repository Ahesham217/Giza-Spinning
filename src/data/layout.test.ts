import { describe, expect, it } from "vitest";
import {
  NODE_HEIGHT,
  NODE_WIDTH,
  activitiesInView,
  edgeRoute,
  edgesInView,
  getActivity,
  phases,
  type Point,
  type Side,
  type ViewId,
} from "./workflow";

const views: ViewId[] = ["all", "development", "order-materials", "production-shipment"];

function handlePoint(position: Point, side: Side): Point {
  switch (side) {
    case "top":
      return { x: position.x + NODE_WIDTH / 2, y: position.y };
    case "right":
      return { x: position.x + NODE_WIDTH, y: position.y + NODE_HEIGHT / 2 };
    case "bottom":
      return { x: position.x + NODE_WIDTH / 2, y: position.y + NODE_HEIGHT };
    case "left":
      return { x: position.x, y: position.y + NODE_HEIGHT / 2 };
  }
}

function segmentHitsNode(start: Point, end: Point, box: Point): boolean {
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  const steps = Math.max(2, Math.ceil(length / 8));
  const inset = 6;
  for (let index = 1; index < steps; index += 1) {
    const t = index / steps;
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t;
    if (
      x > box.x + inset &&
      x < box.x + NODE_WIDTH - inset &&
      y > box.y + inset &&
      y < box.y + NODE_HEIGHT - inset
    ) {
      return true;
    }
  }
  return false;
}

describe("diagram layout", () => {
  it("does not overlap activity nodes in any view", () => {
    const overlaps: string[] = [];
    for (const view of views) {
      const nodes = activitiesInView(view);
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i].positions[view]!;
          const b = nodes[j].positions[view]!;
          const separated =
            a.x + NODE_WIDTH <= b.x ||
            b.x + NODE_WIDTH <= a.x ||
            a.y + NODE_HEIGHT <= b.y ||
            b.y + NODE_HEIGHT <= a.y;
          if (!separated) overlaps.push(`${view}: ${nodes[i].id} overlaps ${nodes[j].id}`);
        }
      }
    }
    expect(overlaps).toEqual([]);
  });

  it("routes edges around unrelated activities", () => {
    const hits: string[] = [];
    for (const view of views) {
      const nodes = activitiesInView(view);
      for (const edge of edgesInView(view)) {
        const route = edgeRoute(edge, view);
        const source = getActivity(edge.source).positions[view]!;
        const target = getActivity(edge.target).positions[view]!;
        const points = [
          handlePoint(source, route.sourceSide),
          ...route.via,
          handlePoint(target, route.targetSide),
        ];
        for (let index = 0; index < points.length - 1; index += 1) {
          for (const node of nodes) {
            if (node.id === edge.source || node.id === edge.target) continue;
            if (segmentHitsNode(points[index], points[index + 1], node.positions[view]!)) {
              hits.push(`${view}: ${edge.id} crosses ${node.id}`);
            }
          }
        }
      }
    }
    expect(hits).toEqual([]);
  });

  it("places edge labels outside activity nodes", () => {
    const hits: string[] = [];
    for (const view of views) {
      const nodes = activitiesInView(view);
      for (const edge of edgesInView(view)) {
        if (!edge.label) continue;
        const route = edgeRoute(edge, view);
        const source = getActivity(edge.source).positions[view]!;
        const target = getActivity(edge.target).positions[view]!;
        const points = [
          handlePoint(source, route.sourceSide),
          ...route.via,
          handlePoint(target, route.targetSide),
        ];
        let best = -1;
        let mid = points[0];
        for (let index = 0; index < points.length - 1; index += 1) {
          const start = points[index];
          const end = points[index + 1];
          const length = Math.hypot(end.x - start.x, end.y - start.y);
          if (length > best) {
            best = length;
            mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
          }
        }
        const anchor = edge.labelAt?.[view] ?? mid;
        const labelWidth = edge.label.length * 6.3 + 14;
        const labelHeight = 18;
        const labelBox = {
          x: anchor.x - labelWidth / 2,
          y: anchor.y - labelHeight / 2,
          right: anchor.x + labelWidth / 2,
          bottom: anchor.y + labelHeight / 2,
        };
        for (const node of nodes) {
          const box = node.positions[view]!;
          const overlaps = !(
            labelBox.right < box.x ||
            labelBox.x > box.x + NODE_WIDTH ||
            labelBox.bottom < box.y ||
            labelBox.y > box.y + NODE_HEIGHT
          );
          if (overlaps) hits.push(`${view}: ${edge.id} label sits on ${node.id}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });

  it("keeps phase frames off activities from other phases", () => {
    const hits: string[] = [];
    for (const view of views) {
      const visible = activitiesInView(view);
      for (const phase of phases) {
        if (
          (view === "production-shipment" || view === "order-materials") &&
          phase.id === "sample-development"
        ) {
          continue;
        }
        const members = visible.filter((activity) => activity.phaseId === phase.id);
        if (members.length === 0) continue;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const activity of members) {
          const point = activity.positions[view]!;
          minX = Math.min(minX, point.x);
          minY = Math.min(minY, point.y);
          maxX = Math.max(maxX, point.x + NODE_WIDTH);
          maxY = Math.max(maxY, point.y + NODE_HEIGHT);
        }
        const frame = {
          x: minX - phase.extraLeft,
          y: minY - phase.extraTop,
          right: maxX + phase.extraRight,
          bottom: maxY + phase.extraBottom,
        };
        for (const activity of visible) {
          if (activity.phaseId === phase.id) continue;
          const point = activity.positions[view]!;
          const overlaps = !(
            point.x + NODE_WIDTH <= frame.x ||
            frame.right <= point.x ||
            point.y + NODE_HEIGHT <= frame.y ||
            frame.bottom <= point.y
          );
          if (overlaps) hits.push(`${view}: ${phase.id} frame covers ${activity.id}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});
