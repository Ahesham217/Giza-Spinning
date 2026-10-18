import type { Node, NodeProps } from "@xyflow/react";

export type PhaseNodeData = {
  title: string;
  caption?: string;
};

export type PhaseFlowNode = Node<PhaseNodeData, "phase">;

export function PhaseFrame({ data }: NodeProps<PhaseFlowNode>) {
  return (
    <div className="h-full w-full rounded-xl border border-[#d5dce6] bg-white/80">
      <div className="px-3 pt-2">
        <p className="text-[13px] font-semibold leading-5 text-[#334155]">{data.title}</p>
        {data.caption && (
          <p className="mt-0.5 max-w-xl text-[12px] leading-4 text-[#3e4c63]">{data.caption}</p>
        )}
      </div>
    </div>
  );
}
