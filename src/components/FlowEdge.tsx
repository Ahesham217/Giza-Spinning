import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";
import type { Point } from "../data/workflow";

export type FlowEdgeData = {
  via?: Point[];
  labelAt?: Point;
};

export type FlowEdgeType = Edge<FlowEdgeData, "flow">;

function labelAnchor(points: Point[]): Point {
  let best = -1;
  let mid = points[0] ?? { x: 0, y: 0 };
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    if (length > best) {
      best = length;
      mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    }
  }
  return mid;
}

export function FlowEdge(props: EdgeProps<FlowEdgeType>) {
  const via = props.data?.via ?? [];
  let path: string;
  let labelX: number;
  let labelY: number;

  if (via.length > 0) {
    const points = [{ x: props.sourceX, y: props.sourceY }, ...via, { x: props.targetX, y: props.targetY }];
    path = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");
    const anchor = props.data?.labelAt ?? labelAnchor(points);
    labelX = anchor.x;
    labelY = anchor.y;
  } else if (
    Math.abs(props.sourceX - props.targetX) < 1.5 ||
    Math.abs(props.sourceY - props.targetY) < 1.5
  ) {
    path = `M ${props.sourceX} ${props.sourceY} L ${props.targetX} ${props.targetY}`;
    labelX = props.data?.labelAt?.x ?? (props.sourceX + props.targetX) / 2;
    labelY = props.data?.labelAt?.y ?? (props.sourceY + props.targetY) / 2;
  } else {
    const [smooth, lx, ly] = getSmoothStepPath({
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      targetX: props.targetX,
      targetY: props.targetY,
      sourcePosition: props.sourcePosition,
      targetPosition: props.targetPosition,
      borderRadius: 10,
      offset: 16,
    });
    path = smooth;
    labelX = props.data?.labelAt?.x ?? lx;
    labelY = props.data?.labelAt?.y ?? ly;
  }

  return (
    <>
      <BaseEdge id={props.id} path={path} markerEnd={props.markerEnd} style={props.style} interactionWidth={16} />
      {props.label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute rounded border border-[#d5dce6] bg-white px-1.5 py-0.5 text-[11px] font-medium leading-4 text-[#10243f] shadow-sm"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {props.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
