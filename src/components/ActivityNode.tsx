import type { CSSProperties } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import {
  BadgeCheck,
  Briefcase,
  Calculator,
  CalendarClock,
  Cog,
  Factory,
  GitMerge,
  Layers,
  Package,
  Scissors,
  Truck,
  UserRound,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { DepartmentId, NodeKind } from "../data/workflow";
import type { Emphasis } from "../lib/buildFlow";

export type ActivityNodeData = {
  title: string;
  departmentLabel: string;
  departmentId: DepartmentId;
  kind: NodeKind;
  approval: boolean;
  background: string;
  border: string;
  color: string;
  emphasis: Emphasis;
  statusLabel?: string;
};

export type ActivityFlowNode = Node<ActivityNodeData, "activity">;

const icons: Record<DepartmentId, LucideIcon> = {
  merchandising: Briefcase,
  "sample-room": Scissors,
  fabric: Layers,
  developing: Calculator,
  client: UserRound,
  appstreme: Cog,
  warehouse: Warehouse,
  planning: CalendarClock,
  production: Factory,
  packing: Package,
  shipping: Truck,
  gate: GitMerge,
};

const sides = [
  { id: "top", position: Position.Top },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
] as const;

function handleStyle(position: Position): CSSProperties {
  if (position === Position.Top || position === Position.Bottom) {
    return { left: "50%", opacity: 0, width: 6, height: 6, border: 0, background: "transparent" };
  }
  return { top: "50%", opacity: 0, width: 6, height: 6, border: 0, background: "transparent" };
}

export function ActivityNode({ data }: NodeProps<ActivityFlowNode>) {
  const Icon = icons[data.departmentId];
  const hot = data.emphasis === "selected" || data.emphasis === "hot";
  const external = data.kind === "external";
  const automatic = data.kind === "automatic";

  return (
    <div
      className="relative flex h-[84px] w-[228px] flex-col justify-center rounded-lg border px-2.5 py-1.5"
      style={{
        background: data.background,
        borderColor: data.border,
        borderStyle: automatic ? "dashed" : "solid",
        borderWidth: automatic ? 1.5 : 1,
        color: data.color,
        boxShadow: external
          ? `inset 0 0 0 1px ${data.border}, 0 0 0 2px ${data.background}, 0 0 0 3.5px ${data.border}${
              hot ? `, 0 0 0 6px ${data.border}` : ""
            }`
          : hot
            ? `0 0 0 2px #ffffff, 0 0 0 4px ${data.border}`
            : "0 1px 1px rgb(16 36 63 / 0.04)",
        opacity: data.emphasis === "dim" ? 0.42 : 1,
      }}
    >
      {sides.map((side) => (
        <Handle
          key={`${side.id}-target`}
          id={`${side.id}-target`}
          type="target"
          position={side.position}
          isConnectable={false}
          style={handleStyle(side.position)}
        />
      ))}
      {sides.map((side) => (
        <Handle
          key={`${side.id}-source`}
          id={`${side.id}-source`}
          type="source"
          position={side.position}
          isConnectable={false}
          style={handleStyle(side.position)}
        />
      ))}
      <div className="flex items-center gap-1.5">
        <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        <span className="truncate text-[11px] font-semibold tracking-wide">{data.departmentLabel}</span>
      </div>
      <p className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-4 text-[#10243f]">
        {data.title}
      </p>
      <div className="mt-0.5 flex h-[15px] items-center gap-1.5 overflow-hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide">
        {data.kind === "external" && <span>External</span>}
        {automatic && <span>Automatic</span>}
        {data.approval && (
          <span className="inline-flex items-center gap-0.5">
            <BadgeCheck aria-hidden="true" className="h-3 w-3" strokeWidth={2.25} />
            Approval
          </span>
        )}
        {data.kind === "gate" && <span>Gate</span>}
        {data.statusLabel && <span className="normal-case tracking-normal">{data.statusLabel}</span>}
      </div>
    </div>
  );
}
