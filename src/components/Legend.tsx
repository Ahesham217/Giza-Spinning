export function Legend() {
  return (
    <div className="border-t border-[#d5dce6] bg-white px-3 py-2">
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#10243f]">
        <li className="inline-flex items-center gap-2">
          <svg width="42" height="12" aria-hidden="true">
            <line x1="2" y1="6" x2="32" y2="6" stroke="#334155" strokeWidth="1.75" />
            <path d="M32 2 L40 6 L32 10 Z" fill="#334155" />
          </svg>
          Workflow progression
        </li>
        <li className="inline-flex items-center gap-2">
          <svg width="42" height="12" aria-hidden="true">
            <line x1="2" y1="6" x2="32" y2="6" stroke="#1d4e89" strokeWidth="1.75" strokeDasharray="6 4" />
            <path d="M32 2 L40 6 L32 10 Z" fill="#1d4e89" />
          </svg>
          Information handover
        </li>
        <li className="inline-flex items-center gap-2">
          <svg width="42" height="12" aria-hidden="true">
            <line x1="2" y1="6" x2="32" y2="6" stroke="#2f6b45" strokeWidth="2" />
            <path d="M32 2 L40 6 L32 10 Z" fill="#2f6b45" />
          </svg>
          Physical material transfer
        </li>
        <li className="inline-flex items-center gap-2">
          <svg width="42" height="12" aria-hidden="true">
            <line x1="2" y1="6" x2="32" y2="6" stroke="#8a5a12" strokeWidth="2" strokeDasharray="1.5 4" />
            <path d="M32 2 L40 6 L32 10 Z" fill="#8a5a12" />
          </svg>
          Approval dependency
        </li>
        <li className="inline-flex items-center gap-2">
          <span className="inline-block h-3.5 w-5 rounded-sm border border-dashed border-[#245b93]" />
          Automatic
        </li>
        <li className="inline-flex items-center gap-2">
          <span className="inline-block h-3.5 w-5 rounded-sm border-2 border-double border-[#9a5b2f]" />
          Client, external
        </li>
        <li className="inline-flex items-center gap-2">
          <span className="inline-block rounded-sm border border-[#8a7340] bg-[#f7f4ea] px-1 text-[10px] font-semibold uppercase text-[#4e4120]">
            Gate
          </span>
          Approval gate
        </li>
      </ul>
      <p className="mt-1 text-[11px] leading-4 text-[#3e4c63]">
        Training view of this factory process. Illustrative demos stay in the browser and do not update Appstreme.
      </p>
    </div>
  );
}
