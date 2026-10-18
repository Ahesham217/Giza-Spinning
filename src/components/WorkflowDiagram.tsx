import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { forwardRef, useEffect, useImperativeHandle, useMemo, type ForwardedRef } from "react";
import { ActivityNode } from "./ActivityNode";
import { FlowEdge } from "./FlowEdge";
import { PhaseFrame } from "./PhaseFrame";
import { buildFlow } from "../lib/buildFlow";
import { motionDuration } from "../lib/motion";
import type { ApprovalGateStatus } from "../state/demoLogic";
import { activities, type DepartmentId, type ViewId } from "../data/workflow";

const nodeTypes = { activity: ActivityNode, phase: PhaseFrame };
const edgeTypes = { flow: FlowEdge };

export type DiagramApi = {
  fit: () => void;
  focus: (nodeIds: string[]) => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

type WorkflowDiagramProps = {
  view: ViewId;
  selectedId: string | null;
  departmentId: DepartmentId | "all";
  walkNodeIds: string[] | null;
  approvalStatus: ApprovalGateStatus;
  onSelect: (id: string | null) => void;
};

export const WorkflowDiagram = forwardRef<DiagramApi, WorkflowDiagramProps>(function WorkflowDiagram(
  props,
  ref,
) {
  return (
    <ReactFlowProvider>
      <DiagramCanvas {...props} apiRef={ref} />
    </ReactFlowProvider>
  );
});

function DiagramCanvas({
  view,
  selectedId,
  departmentId,
  walkNodeIds,
  approvalStatus,
  onSelect,
  apiRef,
}: WorkflowDiagramProps & { apiRef: ForwardedRef<DiagramApi> }) {
  const { fitView, getViewport, setViewport, zoomIn, zoomOut } = useReactFlow();
  const graph = useMemo(
    () =>
      buildFlow({
        view,
        selectedId,
        departmentId,
        walkNodeIds,
        approvalStatus,
      }),
    [view, selectedId, departmentId, walkNodeIds, approvalStatus],
  );

  useImperativeHandle(apiRef, () => ({
    fit() {
      void fitView({
        padding: 0.12,
        duration: motionDuration(280),
        maxZoom: view === "all" ? 0.95 : 1.05,
        minZoom: 0.25,
      });
    },
    focus(nodeIds: string[]) {
      void fitView({
        nodes: nodeIds.map((id) => ({ id })),
        padding: 0.35,
        duration: motionDuration(280),
        maxZoom: 1.1,
      });
    },
    zoomIn() {
      void zoomIn({ duration: motionDuration(160) });
    },
    zoomOut() {
      void zoomOut({ duration: motionDuration(160) });
    },
  }));

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      const duration = motionDuration(280);
      if (view !== "all") {
        void fitView({ padding: 0.1, duration, maxZoom: 1.05 });
        return;
      }
      void fitView({
        nodes: activities
          .filter((activity) => activity.phaseId === "sample-development")
          .map((activity) => ({ id: activity.id })),
        padding: 0.1,
        duration,
        maxZoom: 1,
      }).then(() => {
        if (cancelled) return;
        const pane = document.querySelector(".react-flow")?.getBoundingClientRect();
        const nextPhase = document
          .querySelector('.react-flow__node[data-id="phase-approvals-order"]')
          ?.getBoundingClientRect();
        if (!pane || !nextPhase) return;
        const clipped = nextPhase.top < pane.bottom - 12 && nextPhase.bottom > pane.bottom - 8;
        if (!clipped) return;
        const viewport = getViewport();
        void setViewport(
          {
            x: viewport.x,
            y: viewport.y + (pane.bottom - nextPhase.top + 16),
            zoom: viewport.zoom,
          },
          { duration: 0 },
        );
      });
    }, 40);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [view, fitView, getViewport, setViewport]);

  const onNodeClick: NodeMouseHandler = (_, node) => {
    if (node.type === "phase") return;
    onSelect(node.id);
  };

  return (
    <ReactFlow
      nodes={graph.nodes}
      edges={graph.edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeClick={onNodeClick}
      onPaneClick={() => onSelect(null)}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
      panOnScroll
      zoomOnDoubleClick={false}
      minZoom={0.28}
      maxZoom={1.6}
      proOptions={{ hideAttribution: false }}
      colorMode="light"
      aria-label="Factory workflow diagram"
    >
      <Background color="#d5dce6" gap={22} size={1} />
    </ReactFlow>
  );
}
