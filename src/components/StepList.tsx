import { activities, departments, phases, type Activity } from "../data/workflow";

type StepListProps = {
  selectedId: string | null;
  onOpen: (id: string) => void;
};

export function StepList({ selectedId, onOpen }: StepListProps) {
  const ordered = [...activities].sort((a, b) => a.listOrder - b.listOrder);
  const byPhase = phases
    .map((phase) => ({
      phase,
      items: ordered.filter((activity) => activity.phaseId === phase.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <nav aria-label="Step list" className="h-full overflow-y-auto bg-white">
      <div className="border-b border-[#d5dce6] px-3 py-2">
        <h2 className="text-sm font-semibold text-[#10243f]">Step list</h2>
        <p className="text-xs leading-4 text-[#3e4c63]">
          The same activities as the diagram, in process order. Parallel work is marked.
        </p>
      </div>
      <div className="space-y-3 px-2 py-2">
        {byPhase.map(({ phase, items }) => (
          <section key={phase.id} aria-labelledby={`phase-${phase.id}`}>
            <h3 id={`phase-${phase.id}`} className="px-1 text-xs font-semibold uppercase tracking-wide text-[#526277]">
              {phase.title}
            </h3>
            <ol className="mt-1 space-y-1">
              {items.map((activity) => (
                <li key={activity.id}>
                  <StepButton activity={activity} selected={activity.id === selectedId} onOpen={onOpen} />
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </nav>
  );
}

function StepButton({
  activity,
  selected,
  onOpen,
}: {
  activity: Activity;
  selected: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`w-full rounded-md border px-2 py-1.5 text-left ${
        selected ? "border-[#1e3a5f] bg-[#e7eef6]" : "border-transparent hover:border-[#d5dce6] hover:bg-[#f8fafc]"
      }`}
      aria-current={selected ? "true" : undefined}
      onClick={() => onOpen(activity.id)}
    >
      <span className="block text-[11px] font-semibold text-[#334155]">
        {departments[activity.departmentId].label}
        {activity.parallelGroup ? " · Parallel" : ""}
        {activity.kind === "automatic" ? " · Automatic" : ""}
        {activity.kind === "external" ? " · External" : ""}
        {activity.approval ? " · Approval" : ""}
      </span>
      <span className="block text-sm font-medium text-[#10243f]">{activity.title}</span>
    </button>
  );
}
