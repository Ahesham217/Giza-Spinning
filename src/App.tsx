import { useEffect, useRef, useState } from "react";
import { DetailsPanel } from "./components/DetailsPanel";
import { Legend } from "./components/Legend";
import { StepList } from "./components/StepList";
import { Toolbar } from "./components/Toolbar";
import { WorkflowDiagram, type DiagramApi } from "./components/WorkflowDiagram";
import {
  getActivity,
  viewContaining,
  walkthrough,
  type DepartmentId,
  type ViewId,
} from "./data/workflow";
import { getApprovalGateStatus, initialApprovalFlags, initialBatchDemoState } from "./state/demoLogic";

export function App() {
  const [view, setView] = useState<ViewId>("all");
  const [departmentId, setDepartmentId] = useState<DepartmentId | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [walkIndex, setWalkIndex] = useState<number | null>(null);
  const [approvals, setApprovals] = useState(initialApprovalFlags);
  const [batches, setBatches] = useState(initialBatchDemoState);
  const [stepsOpen, setStepsOpen] = useState(false);
  const diagramRef = useRef<DiagramApi>(null);

  const walkStep = walkIndex === null ? null : walkthrough[walkIndex];
  const selected = selectedId ? getActivity(selectedId) : null;
  const approvalStatus = getApprovalGateStatus(approvals);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const apply = () => setStepsOpen(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    if (!getActivity(selectedId).views.includes(view)) setSelectedId(null);
  }, [view, selectedId]);

  useEffect(() => {
    if (walkIndex === null) return;
    const ids = walkthrough[walkIndex].nodeIds;
    const missing = ids.some((id) => !getActivity(id).views.includes(view));
    if (missing) {
      setView("all");
      return;
    }
    const timer = window.setTimeout(() => diagramRef.current?.focus(ids), 90);
    return () => window.clearTimeout(timer);
  }, [walkIndex, view]);

  function openActivity(id: string) {
    const activity = getActivity(id);
    const nextView = viewContaining(activity, view);
    if (nextView !== view) setView(nextView);
    setSelectedId(id);
    window.setTimeout(() => diagramRef.current?.focus([id]), nextView === view ? 30 : 120);
  }

  function resetDemo() {
    setApprovals({ ...initialApprovalFlags });
    setBatches({ ...initialBatchDemoState });
    setWalkIndex(null);
  }

  function startWalk() {
    setWalkIndex(0);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f6f8] text-[#10243f] lg:h-dvh lg:overflow-hidden">
      <a
        href="#diagram"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to diagram
      </a>
      <header className="border-b border-[#d5dce6] bg-white px-4 py-2.5">
        <h1 className="text-lg font-semibold tracking-tight text-[#10243f]">Appstreme Factory Workflow</h1>
        <p className="text-sm leading-5 text-[#334155]">
          Explore responsibilities, information and handovers from sample request to shipment.
        </p>
      </header>
      <Toolbar
        view={view}
        departmentId={departmentId}
        walkIndex={walkIndex}
        walkCount={walkthrough.length}
        stepsOpen={stepsOpen}
        onView={setView}
        onDepartment={setDepartmentId}
        onStartWalk={startWalk}
        onPreviousWalk={() => setWalkIndex((index) => (index === null ? 0 : Math.max(0, index - 1)))}
        onNextWalk={() =>
          setWalkIndex((index) =>
            index === null ? 0 : Math.min(walkthrough.length - 1, index + 1),
          )
        }
        onExitWalk={() => setWalkIndex(null)}
        onZoomIn={() => diagramRef.current?.zoomIn()}
        onZoomOut={() => diagramRef.current?.zoomOut()}
        onFit={() => diagramRef.current?.fit()}
        onReset={resetDemo}
        onToggleSteps={() => setStepsOpen((open) => !open)}
      />
      {walkStep && (
        <div className="border-b border-[#d5dce6] bg-[#f8fafc] px-4 py-2" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#526277]">
            Walkthrough · Step {walkIndex! + 1} of {walkthrough.length} · {walkStep.title}
          </p>
          <p className="mt-0.5 max-w-4xl text-sm leading-5 text-[#10243f]">{walkStep.body}</p>
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {stepsOpen && (
          <div className="hidden w-72 shrink-0 overflow-hidden border-r border-[#d5dce6] bg-white lg:block">
            <StepList selectedId={selectedId} onOpen={openActivity} />
          </div>
        )}
        <div className="relative h-[62dvh] min-h-[420px] flex-1 lg:h-auto lg:min-h-0">
          <div id="diagram" className="absolute inset-0 bg-[#f4f6f8]">
            <WorkflowDiagram
              ref={diagramRef}
              view={view}
              selectedId={selectedId}
              departmentId={departmentId}
              walkNodeIds={walkStep ? walkStep.nodeIds : null}
              approvalStatus={approvalStatus}
              onSelect={setSelectedId}
            />
          </div>
        </div>
        <aside
          className="hidden w-[380px] shrink-0 border-l border-[#d5dce6] lg:block"
          aria-label="Activity details"
        >
          <DetailsPanel
            activity={selected}
            walkTitle={walkStep?.title}
            walkBody={walkStep?.body}
            approvals={approvals}
            batches={batches}
            onApprovals={setApprovals}
            onBatches={setBatches}
            onOpenActivity={openActivity}
          />
        </aside>
      </div>
      <Legend />
      <section className="border-t border-[#d5dce6] lg:hidden" aria-label="Step list">
        {stepsOpen && <StepList selectedId={selectedId} onOpen={openActivity} />}
      </section>
      {selected && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 max-h-[52dvh] overflow-y-auto rounded-t-xl border border-[#d5dce6] bg-white shadow-2xl lg:hidden"
          role="dialog"
          aria-label="Activity details"
        >
          <DetailsPanel
            activity={selected}
            approvals={approvals}
            batches={batches}
            onApprovals={setApprovals}
            onBatches={setBatches}
            onOpenActivity={openActivity}
            onClose={() => setSelectedId(null)}
            layout="sheet"
          />
        </div>
      )}
    </div>
  );
}
