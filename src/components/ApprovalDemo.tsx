import { approvalStatusMessage, type ApprovalFlags } from "../state/demoLogic";

type ApprovalDemoProps = {
  flags: ApprovalFlags;
  onChange: (flags: ApprovalFlags) => void;
};

export function ApprovalDemo({ flags, onChange }: ApprovalDemoProps) {
  const message = approvalStatusMessage(flags);
  const open = message === "Both approvals complete.";

  return (
    <fieldset className="rounded-lg border border-[#d5dce6] bg-[#f8fafc] p-3">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-[#334155]">
        Illustrative demo
      </legend>
      <p className="text-sm leading-5 text-[#334155]">
        These controls stay in this page. They do not update live Appstreme data.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        <label className="flex items-start gap-2 text-sm text-[#10243f]">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[#1e3a5f]"
            checked={flags.clientSampleApproved}
            onChange={(event) =>
              onChange({ ...flags, clientSampleApproved: event.target.checked })
            }
          />
          <span>Client sample approved</span>
        </label>
        <label className="flex items-start gap-2 text-sm text-[#10243f]">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[#1e3a5f]"
            checked={flags.costingApproved}
            onChange={(event) => onChange({ ...flags, costingApproved: event.target.checked })}
          />
          <span>Costing approved internally</span>
        </label>
      </div>
      <p
        className={`mt-3 text-sm font-semibold ${open ? "text-[#1f6b5a]" : "text-[#8a5a12]"}`}
        aria-live="polite"
      >
        {message}
      </p>
      <p className="mt-1 text-sm leading-5 text-[#334155]">
        The customer must also place the order before order entry proceeds.
      </p>
    </fieldset>
  );
}
