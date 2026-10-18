import type { ReactNode } from "react";
import { X } from "lucide-react";
import {
  batchActivityIds,
  departments,
  edgeKindLabel,
  edges,
  getActivity,
  type Activity,
} from "../data/workflow";
import type { ApprovalFlags, BatchDemoState } from "../state/demoLogic";
import { ApprovalDemo } from "./ApprovalDemo";
import { BatchDemo } from "./BatchDemo";

type DetailsPanelProps = {
  activity: Activity | null;
  walkTitle?: string;
  walkBody?: string;
  approvals: ApprovalFlags;
  batches: BatchDemoState;
  onApprovals: (flags: ApprovalFlags) => void;
  onBatches: (batches: BatchDemoState) => void;
  onOpenActivity: (id: string) => void;
  onClose?: () => void;
  layout?: "panel" | "sheet";
};

export function DetailsPanel({
  activity,
  walkTitle,
  walkBody,
  approvals,
  batches,
  onApprovals,
  onBatches,
  onOpenActivity,
  onClose,
  layout = "panel",
}: DetailsPanelProps) {
  const sheet = layout === "sheet";
  return (
    <div className={sheet ? "flex flex-col bg-white" : "flex h-full min-h-0 flex-col bg-white"}>
      <div className="flex items-start justify-between gap-3 border-b border-[#d5dce6] px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#526277]">Activity details</p>
          {activity ? (
            <h2 className="mt-1 text-lg font-semibold leading-6 text-[#10243f]">{activity.title}</h2>
          ) : (
            <h2 className="mt-1 text-lg font-semibold leading-6 text-[#10243f]">Nothing selected</h2>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            className="rounded-md border border-[#d5dce6] p-1.5 text-[#10243f] hover:bg-[#eef3f8]"
            onClick={onClose}
            aria-label="Close details"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className={sheet ? "px-4 py-4" : "min-h-0 flex-1 overflow-y-auto px-4 py-4"}>
        {activity ? (
          <ActivityBody
            activity={activity}
            approvals={approvals}
            batches={batches}
            onApprovals={onApprovals}
            onBatches={onBatches}
            onOpenActivity={onOpenActivity}
          />
        ) : (
          <div className="space-y-3 text-sm leading-6 text-[#334155]">
            <p>Select an activity on the diagram or in the step list.</p>
            {walkTitle && walkBody && (
              <div className="rounded-lg border border-[#d5dce6] bg-[#f8fafc] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#526277]">Walkthrough</p>
                <p className="mt-1 font-semibold text-[#10243f]">{walkTitle}</p>
                <p className="mt-1">{walkBody}</p>
              </div>
            )}
            <p>
              Approval and batch controls are illustrative demos on the approval gate and the receiving activities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityBody({
  activity,
  approvals,
  batches,
  onApprovals,
  onBatches,
  onOpenActivity,
}: {
  activity: Activity;
  approvals: ApprovalFlags;
  batches: BatchDemoState;
  onApprovals: (flags: ApprovalFlags) => void;
  onBatches: (batches: BatchDemoState) => void;
  onOpenActivity: (id: string) => void;
}) {
  const department = departments[activity.departmentId];
  const incoming = edges.filter((edge) => edge.target === activity.id);
  const outgoing = edges.filter((edge) => edge.source === activity.id);

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-[#10243f]">
        {department.label}
        {activity.kind === "external" && " · External"}
        {activity.kind === "automatic" && " · Automatic"}
        {activity.approval && " · Approval"}
        {activity.parallelGroup && ` · ${activity.parallelGroup}`}
      </p>
      <Section title="What happens">
        <p>{activity.summary}</p>
      </Section>
      <ListSection title="Data entered" items={activity.dataEntered} />
      <ListSection title="Inputs received" items={activity.inputs} />
      <ListSection title="Outputs produced" items={activity.outputs} />
      <ConnectionList title="Previous activities" edges={incoming} direction="source" onOpen={onOpenActivity} />
      <ConnectionList title="Next activities" edges={outgoing} direction="target" onOpen={onOpenActivity} />
      {activity.id === "approval-gate" && <ApprovalDemo flags={approvals} onChange={onApprovals} />}
      {(batchActivityIds as readonly string[]).includes(activity.id) && (
        <BatchDemo batches={batches} onChange={onBatches} />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#526277]">{title}</h3>
      <div className="mt-1 text-sm leading-6 text-[#10243f]">{children}</div>
    </section>
  );
}

function ListSection({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <Section title={title}>
      <ul className="list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Section>
  );
}

function ConnectionList({
  title,
  edges: related,
  direction,
  onOpen,
}: {
  title: string;
  edges: typeof edges;
  direction: "source" | "target";
  onOpen: (id: string) => void;
}) {
  if (related.length === 0) return null;
  return (
    <Section title={title}>
      <ul className="space-y-2">
        {related.map((edge) => {
          const otherId = direction === "source" ? edge.source : edge.target;
          const other = getActivity(otherId);
          return (
            <li key={edge.id}>
              <button
                type="button"
                className="w-full rounded-md border border-[#d5dce6] bg-white px-3 py-2 text-left hover:bg-[#eef3f8]"
                onClick={() => onOpen(other.id)}
              >
                <span className="block text-sm font-semibold text-[#10243f]">{other.title}</span>
                <span className="mt-0.5 block text-xs text-[#334155]">
                  {departments[other.departmentId].label}
                  {" · "}
                  {edgeKindLabel[edge.kind]}
                  {edge.label ? ` · ${edge.label}` : ""}
                </span>
                <span className="mt-1 block text-xs font-semibold text-[#1d4e89]">Focus on diagram</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
