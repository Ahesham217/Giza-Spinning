import { MarkerType, type Edge, type Node } from "@xyflow/react";
import type { ApprovalGateStatus } from "../state/demoLogic";
import { approvalStatusMessage } from "../state/demoLogic";
import {
  NODE_HEIGHT,
  NODE_WIDTH,
  activitiesInView,
  approvalPathEdgeIds,
  approvalPathNodeIds,
  departments,
  edgeRoute,
  edgesInView,
  getActivity,
  phases,
  type DepartmentId,
  type PhaseId,
  type Side,
  type ViewId,
} from "../data/workflow";
import type { ActivityNodeData } from "../components/ActivityNode";
import type { PhaseNodeData } from "../components/PhaseFrame";

export type Emphasis = "selected" | "hot" | "dim" | "normal" | "closed";

const edgePaint = {
  progression: { stroke: "#334155", dash: undefined as string | undefined, width: 1.75 },
  information: { stroke: "#1d4e89", dash: "7 5", width: 1.75 },
  material: { stroke: "#2f6b45", dash: undefined as string | undefined, width: 2.15 },
  approval: { stroke: "#8a5a12", dash: "1.5 5", width: 2 },
};

function handleId(side: Side, role: "source" | "target"): string {
  return `${side}-${role}`;
}

function connectedIds(id: string, view: ViewId): Set<string> {
  const next = new Set<string>();
  for (const edge of edgesInView(view)) {
    if (edge.source === id) next.add(edge.target);
    if (edge.target === id) next.add(edge.source);
  }
  return next;
}

export function buildFlow(input: {
  view: ViewId;
  selectedId: string | null;
  departmentId: DepartmentId | "all";
  walkNodeIds: string[] | null;
  approvalStatus: ApprovalGateStatus;
}): { nodes: Node[]; edges: Edge[] } {
  const visible = activitiesInView(input.view);
  const visibleEdges = edgesInView(input.view);
  const walking = input.walkNodeIds !== null;
  const walk = new Set(input.walkNodeIds ?? []);
  const neighbors = input.selectedId ? connectedIds(input.selectedId, input.view) : new Set<string>();
  const approvalNodes = new Set<string>(approvalPathNodeIds);
  const approvalEdges = new Set<string>(approvalPathEdgeIds);

  const phaseNodes: Node<PhaseNodeData>[] = [];
  const grouped = new Map<PhaseId, typeof visible>();
  for (const activity of visible) {
    const list = grouped.get(activity.phaseId) ?? [];
    list.push(activity);
    grouped.set(activity.phaseId, list);
  }

  for (const phase of phases) {
    const members = grouped.get(phase.id);
    if (!members || members.length === 0) continue;
    if (
      (input.view === "production-shipment" || input.view === "order-materials") &&
      phase.id === "sample-development"
    ) {
      continue;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const activity of members) {
      const point = activity.positions[input.view];
      if (!point) continue;
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x + NODE_WIDTH);
      maxY = Math.max(maxY, point.y + NODE_HEIGHT);
    }

    phaseNodes.push({
      id: `phase-${phase.id}`,
      type: "phase",
      position: { x: minX - phase.extraLeft, y: minY - phase.extraTop },
      data: { title: phase.title, caption: phase.caption },
      draggable: false,
      selectable: false,
      connectable: false,
      focusable: false,
      zIndex: 0,
      style: {
        width: maxX - minX + phase.extraLeft + phase.extraRight,
        height: maxY - minY + phase.extraTop + phase.extraBottom,
        pointerEvents: "none",
      },
    });
  }

  const activityNodes: Node<ActivityNodeData>[] = visible.map((activity) => {
    const point = activity.positions[input.view];
    if (!point) {
      throw new Error(`Missing position for ${activity.id}`);
    }
    const department = departments[activity.departmentId];
    let emphasis: Emphasis = "normal";
    if (walking) {
      if (activity.id === input.selectedId) emphasis = "selected";
      else if (walk.has(activity.id)) emphasis = "hot";
      else emphasis = "dim";
    } else if (input.selectedId) {
      if (activity.id === input.selectedId) emphasis = "selected";
      else if (neighbors.has(activity.id)) emphasis = "hot";
      else emphasis = "dim";
    } else if (input.departmentId !== "all") {
      emphasis = activity.departmentId === input.departmentId ? "hot" : "dim";
    } else if (input.approvalStatus === "complete" && approvalNodes.has(activity.id)) {
      emphasis = "hot";
    }

    const statusLabel =
      activity.id === "approval-gate"
        ? input.approvalStatus === "complete"
          ? "Both complete"
          : "Pending"
        : undefined;

    const indicator = [
      activity.kind === "automatic" ? "Automatic." : "",
      activity.kind === "external" ? "External client action." : "",
      activity.approval ? "Requires approval." : "",
      activity.kind === "gate" ? approvalStatusMessage({
        clientSampleApproved: input.approvalStatus === "complete",
        costingApproved: input.approvalStatus === "complete",
      }) : "",
    ]
      .filter(Boolean)
      .join(" ");

    return {
      id: activity.id,
      type: "activity",
      position: point,
      zIndex: emphasis === "dim" ? 2 : 4,
      draggable: false,
      connectable: false,
      selectable: true,
      ariaLabel: `${department.label}. ${activity.title}. ${indicator}`.trim(),
      data: {
        title: activity.title,
        departmentLabel: department.label,
        departmentId: activity.departmentId,
        kind: activity.kind,
        approval: Boolean(activity.approval),
        background: department.background,
        border: department.border,
        color: department.color,
        emphasis,
        statusLabel,
      },
    };
  });

  const flowEdges: Edge[] = visibleEdges.map((edge) => {
    const route = edgeRoute(edge, input.view);
    const paint = edgePaint[edge.kind];
    let emphasis: Emphasis = "normal";
    const sourceDept = getActivity(edge.source).departmentId;
    const targetDept = getActivity(edge.target).departmentId;

    if (input.selectedId && (edge.source === input.selectedId || edge.target === input.selectedId)) {
      emphasis = "hot";
    } else if (walking) {
      const sourceHit = walk.has(edge.source);
      const targetHit = walk.has(edge.target);
      emphasis = sourceHit && targetHit ? "hot" : sourceHit || targetHit ? "normal" : "dim";
    } else if (input.selectedId) {
      emphasis =
        edge.source === input.selectedId || edge.target === input.selectedId ? "hot" : "dim";
    } else if (input.departmentId !== "all") {
      const sourceHit = sourceDept === input.departmentId;
      const targetHit = targetDept === input.departmentId;
      emphasis = sourceHit && targetHit ? "hot" : sourceHit || targetHit ? "normal" : "dim";
    } else if (input.approvalStatus === "complete" && approvalEdges.has(edge.id)) {
      emphasis = "hot";
    }

    const closed = edge.id === "e-gate-to-devinfo" && input.approvalStatus !== "complete";
    if (closed && emphasis !== "hot") {
      emphasis = "closed";
    }

    const dimmed = emphasis === "dim" || emphasis === "closed";
    const stroke = dimmed ? "#94a3b8" : paint.stroke;
    const opacity = emphasis === "dim" ? 0.28 : emphasis === "closed" ? 0.4 : 1;

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "flow",
      sourceHandle: handleId(route.sourceSide, "source"),
      targetHandle: handleId(route.targetSide, "target"),
      label: edge.label,
      zIndex: emphasis === "hot" ? 6 : 1,
      data: { via: route.via, kind: edge.kind, labelAt: edge.labelAt?.[input.view] },
      style: {
        stroke,
        strokeWidth: emphasis === "hot" ? paint.width + 0.9 : paint.width,
        strokeDasharray: paint.dash,
        opacity,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 16,
        color: stroke,
      },
    };
  });

  return { nodes: [...phaseNodes, ...activityNodes], edges: flowEdges };
}
