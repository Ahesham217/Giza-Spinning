import {
  batchActionResult,
  batchPhaseLabel,
  canIssue,
  canReceive,
  canStartProduction,
  issueBlockedReason,
  type BatchDemoState,
} from "../state/demoLogic";

type BatchDemoProps = {
  batches: BatchDemoState;
  onChange: (batches: BatchDemoState) => void;
};

export function BatchDemo({ batches, onChange }: BatchDemoProps) {
  function run(action: Parameters<typeof batchActionResult>[1]) {
    const result = batchActionResult(batches, action);
    if (!result.error) onChange(result.state);
  }

  const issueAReason = issueBlockedReason(batches, "A");
  const issueBReason = issueBlockedReason(batches, "B");

  return (
    <section className="rounded-lg border border-[#d5dce6] bg-[#f8fafc] p-3" aria-label="Illustrative batch demo">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#334155]">Illustrative demo</p>
      <p className="mt-1 text-sm leading-5 text-[#334155]">
        Batch A and Batch B are demonstration labels. This does not update inventory or any live Appstreme data.
      </p>
      <ul className="mt-3 space-y-1 text-sm text-[#10243f]" aria-live="polite">
        <li>
          <span className="font-semibold">Batch A:</span> {batchPhaseLabel[batches.A]}
        </li>
        <li>
          <span className="font-semibold">Batch B:</span> {batchPhaseLabel[batches.B]}
        </li>
      </ul>
      <div className="mt-3 flex flex-col gap-2">
        <DemoButton
          label="Receive Batch A"
          disabled={!canReceive(batches, "A")}
          onClick={() => run({ type: "receive", batch: "A" })}
        />
        <DemoButton
          label="Issue Batch A"
          disabled={!canIssue(batches, "A")}
          reason={issueAReason}
          onClick={() => run({ type: "issue", batch: "A" })}
        />
        <DemoButton
          label="Start production using Batch A"
          disabled={!canStartProduction(batches, "A")}
          reason={
            batches.A === "not-received" || batches.A === "received"
              ? "Issue the batch through Planning before production can use it."
              : undefined
          }
          onClick={() => run({ type: "start-production", batch: "A" })}
        />
        <DemoButton
          label="Receive Batch B"
          disabled={!canReceive(batches, "B")}
          onClick={() => run({ type: "receive", batch: "B" })}
        />
        <DemoButton
          label="Issue Batch B"
          disabled={!canIssue(batches, "B")}
          reason={issueBReason}
          onClick={() => run({ type: "issue", batch: "B" })}
        />
      </div>
    </section>
  );
}

function DemoButton({
  label,
  disabled,
  reason,
  onClick,
}: {
  label: string;
  disabled: boolean;
  reason?: string;
  onClick: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        className="w-full rounded-md border border-[#1e3a5f] bg-white px-3 py-1.5 text-left text-sm font-medium text-[#10243f] hover:bg-[#eef3f8] disabled:cursor-not-allowed disabled:border-[#d5dce6] disabled:text-[#64748b] disabled:hover:bg-white"
        disabled={disabled}
        onClick={onClick}
      >
        {label}
      </button>
      {disabled && reason && <p className="mt-1 text-xs leading-4 text-[#3e4c63]">{reason}</p>}
    </div>
  );
}
