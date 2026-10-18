import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, List, Maximize2, Play, RotateCcw, X } from "lucide-react";
import { departmentOrder, departments, diagramViews, type DepartmentId, type ViewId } from "../data/workflow";

type ToolbarProps = {
  view: ViewId;
  departmentId: DepartmentId | "all";
  walkIndex: number | null;
  walkCount: number;
  stepsOpen: boolean;
  onView: (view: ViewId) => void;
  onDepartment: (departmentId: DepartmentId | "all") => void;
  onStartWalk: () => void;
  onPreviousWalk: () => void;
  onNextWalk: () => void;
  onExitWalk: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onReset: () => void;
  onToggleSteps: () => void;
};

export function Toolbar(props: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[#d5dce6] bg-white px-3 py-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-[#10243f]" htmlFor="diagram-view">
          View
        </label>
        <select
          id="diagram-view"
          className="h-9 rounded-md border border-[#d5dce6] bg-white px-2 text-sm text-[#10243f] md:hidden"
          value={props.view}
          onChange={(event) => props.onView(event.target.value as ViewId)}
        >
          {diagramViews.map((view) => (
            <option key={view.id} value={view.id}>
              {view.label}
            </option>
          ))}
        </select>
        <div className="hidden flex-wrap gap-1 md:flex" role="radiogroup" aria-label="Diagram view">
          {diagramViews.map((view) => {
            const selected = props.view === view.id;
            return (
              <button
                key={view.id}
                type="button"
                role="radio"
                aria-checked={selected}
                title={view.description}
                className={`h-9 rounded-md border px-2.5 text-sm ${
                  selected
                    ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                    : "border-[#d5dce6] bg-white text-[#10243f] hover:bg-[#eef3f8]"
                }`}
                onClick={() => props.onView(view.id)}
              >
                {view.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-[#10243f]">
        Department
        <select
          aria-label="Department filter"
          className="h-9 max-w-[220px] rounded-md border border-[#d5dce6] bg-white px-2 text-sm font-normal"
          value={props.departmentId}
          onChange={(event) => props.onDepartment(event.target.value as DepartmentId | "all")}
        >
          <option value="all">All departments</option>
          {departmentOrder.map((id) => (
            <option key={id} value={id}>
              {departments[id].label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap items-center gap-1">
        {props.walkIndex === null ? (
          <ToolbarButton onClick={props.onStartWalk} icon={<Play className="h-4 w-4" aria-hidden="true" />}>
            Start walkthrough
          </ToolbarButton>
        ) : (
          <>
            <ToolbarButton
              onClick={props.onPreviousWalk}
              disabled={props.walkIndex === 0}
              icon={<ChevronLeft className="h-4 w-4" aria-hidden="true" />}
            >
              Previous
            </ToolbarButton>
            <ToolbarButton
              onClick={props.onNextWalk}
              disabled={props.walkIndex >= props.walkCount - 1}
              icon={<ChevronRight className="h-4 w-4" aria-hidden="true" />}
            >
              Next
            </ToolbarButton>
            <ToolbarButton onClick={props.onExitWalk} icon={<X className="h-4 w-4" aria-hidden="true" />}>
              Exit walkthrough
            </ToolbarButton>
          </>
        )}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-1">
        <ToolbarButton
          onClick={props.onToggleSteps}
          pressed={props.stepsOpen}
          icon={<List className="h-4 w-4" aria-hidden="true" />}
        >
          Step list
        </ToolbarButton>
        <ToolbarButton onClick={props.onZoomIn} icon={<span aria-hidden="true">+</span>}>
          Zoom in
        </ToolbarButton>
        <ToolbarButton onClick={props.onZoomOut} icon={<span aria-hidden="true">−</span>}>
          Zoom out
        </ToolbarButton>
        <ToolbarButton onClick={props.onFit} icon={<Maximize2 className="h-4 w-4" aria-hidden="true" />}>
          Fit diagram
        </ToolbarButton>
        <ToolbarButton onClick={props.onReset} icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}>
          Reset demo
        </ToolbarButton>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  icon,
  disabled,
  pressed,
}: {
  children: string;
  onClick: () => void;
  icon: ReactNode;
  disabled?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#d5dce6] bg-white px-2.5 text-sm font-medium text-[#10243f] hover:bg-[#eef3f8] disabled:cursor-not-allowed disabled:text-[#94a3b8]"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
    >
      {icon}
      {children}
    </button>
  );
}
