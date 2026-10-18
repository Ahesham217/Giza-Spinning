import { describe, expect, it } from "vitest";
import {
  approvalStatusMessage,
  batchActionResult,
  getApprovalGateStatus,
  initialApprovalFlags,
  initialBatchDemoState,
  type ApprovalFlags,
  type BatchDemoState,
} from "./demoLogic";

function approvals(flags: Partial<ApprovalFlags>): ApprovalFlags {
  return { ...initialApprovalFlags, ...flags };
}

describe("approval gate", () => {
  it("stays pending when neither approval is set", () => {
    expect(getApprovalGateStatus(initialApprovalFlags)).toBe("pending");
    expect(approvalStatusMessage(initialApprovalFlags)).toBe("Pending required approval.");
  });

  it("stays pending when only the client sample is approved", () => {
    const flags = approvals({ clientSampleApproved: true });
    expect(getApprovalGateStatus(flags)).toBe("pending");
    expect(approvalStatusMessage(flags)).toBe("Pending required approval.");
  });

  it("stays pending when only costing is approved", () => {
    const flags = approvals({ costingApproved: true });
    expect(getApprovalGateStatus(flags)).toBe("pending");
    expect(approvalStatusMessage(flags)).toBe("Pending required approval.");
  });

  it("opens only when both approvals are complete", () => {
    const flags = approvals({ clientSampleApproved: true, costingApproved: true });
    expect(getApprovalGateStatus(flags)).toBe("complete");
    expect(approvalStatusMessage(flags)).toBe("Both approvals complete.");
  });
});

describe("batch transitions", () => {
  it("starts with both batches not received", () => {
    expect(initialBatchDemoState).toEqual({ A: "not-received", B: "not-received" });
  });

  it("refuses to issue a batch before it is received", () => {
    const result = batchActionResult(initialBatchDemoState, { type: "issue", batch: "A" });
    expect(result.error).toBe("Receive the batch before it can be issued.");
    expect(result.state).toEqual(initialBatchDemoState);
  });

  it("refuses to start production before the batch is issued", () => {
    const received = batchActionResult(initialBatchDemoState, { type: "receive", batch: "A" }).state;
    const result = batchActionResult(received, { type: "start-production", batch: "A" });
    expect(result.error).toMatch(/Issue the batch/);
    expect(result.state).toEqual(received);
  });

  it("follows receive, issue, then production for batch A", () => {
    let state: BatchDemoState = initialBatchDemoState;
    state = batchActionResult(state, { type: "receive", batch: "A" }).state;
    expect(state.A).toBe("received");
    state = batchActionResult(state, { type: "issue", batch: "A" }).state;
    expect(state.A).toBe("issued");
    state = batchActionResult(state, { type: "start-production", batch: "A" }).state;
    expect(state.A).toBe("in-production");
  });

  it("allows batch B to arrive and be issued while batch A is in production", () => {
    let state: BatchDemoState = initialBatchDemoState;
    state = batchActionResult(state, { type: "receive", batch: "A" }).state;
    state = batchActionResult(state, { type: "issue", batch: "A" }).state;
    state = batchActionResult(state, { type: "start-production", batch: "A" }).state;
    state = batchActionResult(state, { type: "receive", batch: "B" }).state;
    expect(state.A).toBe("in-production");
    expect(state.B).toBe("received");
    state = batchActionResult(state, { type: "issue", batch: "B" }).state;
    expect(state).toEqual({ A: "in-production", B: "issued" });
  });

  it("does not issue batch B before batch B is received, even if batch A is active", () => {
    let state: BatchDemoState = initialBatchDemoState;
    state = batchActionResult(state, { type: "receive", batch: "A" }).state;
    state = batchActionResult(state, { type: "issue", batch: "A" }).state;
    state = batchActionResult(state, { type: "start-production", batch: "A" }).state;
    const result = batchActionResult(state, { type: "issue", batch: "B" });
    expect(result.error).toBe("Receive the batch before it can be issued.");
    expect(result.state.B).toBe("not-received");
    expect(result.state.A).toBe("in-production");
  });
});
