export type ApprovalFlags = {
  clientSampleApproved: boolean;
  costingApproved: boolean;
};

export type ApprovalGateStatus = "pending" | "complete";

export const initialApprovalFlags: ApprovalFlags = {
  clientSampleApproved: false,
  costingApproved: false,
};

export function getApprovalGateStatus(flags: ApprovalFlags): ApprovalGateStatus {
  return flags.clientSampleApproved && flags.costingApproved ? "complete" : "pending";
}

export function approvalStatusMessage(flags: ApprovalFlags): string {
  return getApprovalGateStatus(flags) === "complete"
    ? "Both approvals complete."
    : "Pending required approval.";
}

export type BatchId = "A" | "B";

export type BatchPhase = "not-received" | "received" | "issued" | "in-production";

export type BatchDemoState = Record<BatchId, BatchPhase>;

export const initialBatchDemoState: BatchDemoState = {
  A: "not-received",
  B: "not-received",
};

export type BatchAction =
  | { type: "receive"; batch: BatchId }
  | { type: "issue"; batch: BatchId }
  | { type: "start-production"; batch: BatchId };

export type BatchActionResult = {
  state: BatchDemoState;
  error?: string;
};

export const batchPhaseLabel: Record<BatchPhase, string> = {
  "not-received": "Not received",
  received: "Received",
  issued: "Issued by Planning",
  "in-production": "In production",
};

export function canReceive(state: BatchDemoState, batch: BatchId): boolean {
  return state[batch] === "not-received";
}

export function canIssue(state: BatchDemoState, batch: BatchId): boolean {
  return state[batch] === "received";
}

export function canStartProduction(state: BatchDemoState, batch: BatchId): boolean {
  return state[batch] === "issued";
}

export function issueBlockedReason(state: BatchDemoState, batch: BatchId): string | undefined {
  if (state[batch] === "not-received") {
    return "Receive the batch before it can be issued.";
  }
  return undefined;
}

export function batchActionResult(state: BatchDemoState, action: BatchAction): BatchActionResult {
  const current = state[action.batch];

  if (action.type === "receive") {
    if (current !== "not-received") {
      return { state, error: "This batch has already been received." };
    }
    return { state: { ...state, [action.batch]: "received" } };
  }

  if (action.type === "issue") {
    if (current === "not-received") {
      return { state, error: "Receive the batch before it can be issued." };
    }
    if (current !== "received") {
      return { state, error: "This batch has already been issued." };
    }
    return { state: { ...state, [action.batch]: "issued" } };
  }

  if (current === "not-received" || current === "received") {
    return {
      state,
      error: "Issue the batch through Planning before production can use it.",
    };
  }
  if (current !== "issued") {
    return { state, error: "Production is already using this batch." };
  }
  return { state: { ...state, [action.batch]: "in-production" } };
}
