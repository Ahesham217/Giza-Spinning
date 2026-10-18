/**
 * Factory workflow used by this training page.
 * Diagram views, details, highlighting and the walkthrough all read from here.
 * Illustrative approval and batch state lives in React, not in this file.
 */

export const NODE_WIDTH = 228;
export const NODE_HEIGHT = 84;

export type DepartmentId =
  | "merchandising"
  | "sample-room"
  | "fabric"
  | "developing"
  | "client"
  | "appstreme"
  | "warehouse"
  | "planning"
  | "production"
  | "packing"
  | "shipping"
  | "gate";

export type PhaseId =
  | "sample-development"
  | "approvals-order"
  | "materials"
  | "receiving-production"
  | "route-tracking"
  | "packing-shipment";

export type ViewId = "all" | "development" | "order-materials" | "production-shipment";

export type EdgeKind = "progression" | "information" | "material" | "approval";

export type NodeKind = "activity" | "automatic" | "external" | "gate";

export type Side = "top" | "right" | "bottom" | "left";

export type Point = { x: number; y: number };

export type Department = {
  id: DepartmentId;
  label: string;
  filterable: boolean;
  background: string;
  border: string;
  color: string;
};

export type Phase = {
  id: PhaseId;
  title: string;
  caption?: string;
  extraTop: number;
  extraRight: number;
  extraBottom: number;
  extraLeft: number;
};

export type DiagramView = {
  id: ViewId;
  label: string;
  description: string;
};

export type Activity = {
  id: string;
  title: string;
  departmentId: DepartmentId;
  phaseId: PhaseId;
  kind: NodeKind;
  approval?: boolean;
  summary: string;
  dataEntered?: string[];
  inputs?: string[];
  outputs?: string[];
  views: ViewId[];
  positions: Partial<Record<ViewId, Point>>;
  listOrder: number;
  parallelGroup?: string;
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  kind: EdgeKind;
  label?: string;
  sourceSide: Side;
  targetSide: Side;
  via?: Partial<Record<ViewId, Point[]>>;
  sides?: Partial<Record<ViewId, { sourceSide: Side; targetSide: Side }>>;
  /** Explicit label anchor when the longest segment would cover a node. */
  labelAt?: Partial<Record<ViewId, Point>>;
  /** When set, the edge is drawn only in these views even if both nodes are present. */
  views?: ViewId[];
};

export type WalkthroughStep = {
  id: string;
  title: string;
  body: string;
  nodeIds: string[];
};

export const diagramViews: DiagramView[] = [
  {
    id: "all",
    label: "Whole workflow",
    description: "Every activity from sample request to shipment.",
  },
  {
    id: "development",
    label: "Development and approval",
    description: "Sample, fabric, costing and the approval gate.",
  },
  {
    id: "order-materials",
    label: "Order and materials",
    description: "Order entry, automatic requirements and purchasing.",
  },
  {
    id: "production-shipment",
    label: "Production and shipment",
    description: "Batches, route tracking, packing and shipment.",
  },
];

export const departments: Record<DepartmentId, Department> = {
  merchandising: {
    id: "merchandising",
    label: "Merchandising",
    filterable: true,
    background: "#e7eef6",
    border: "#1e3a5f",
    color: "#1e3a5f",
  },
  "sample-room": {
    id: "sample-room",
    label: "Sample Room",
    filterable: true,
    background: "#e7f2ef",
    border: "#1f6b5a",
    color: "#14483c",
  },
  fabric: {
    id: "fabric",
    label: "Fabric Department",
    filterable: true,
    background: "#f3eee6",
    border: "#8a6a3b",
    color: "#5c4524",
  },
  developing: {
    id: "developing",
    label: "Developing Department",
    filterable: true,
    background: "#f3eaf4",
    border: "#6e4b7c",
    color: "#4a3056",
  },
  client: {
    id: "client",
    label: "Client",
    filterable: true,
    background: "#f8f1e7",
    border: "#9a5b2f",
    color: "#5c3418",
  },
  appstreme: {
    id: "appstreme",
    label: "Appstreme — Automatic",
    filterable: true,
    background: "#e7f0fa",
    border: "#245b93",
    color: "#163e66",
  },
  warehouse: {
    id: "warehouse",
    label: "Warehouse",
    filterable: true,
    background: "#e8f0e9",
    border: "#3d6b45",
    color: "#24402a",
  },
  planning: {
    id: "planning",
    label: "Planning",
    filterable: true,
    background: "#e9f3f5",
    border: "#2a6a78",
    color: "#1a4550",
  },
  production: {
    id: "production",
    label: "Production",
    filterable: true,
    background: "#f6ede8",
    border: "#8c4a32",
    color: "#5c301f",
  },
  packing: {
    id: "packing",
    label: "Packing Department",
    filterable: true,
    background: "#eeeaf6",
    border: "#53407a",
    color: "#352858",
  },
  shipping: {
    id: "shipping",
    label: "Shipping Department",
    filterable: true,
    background: "#e6f1f4",
    border: "#1e5f73",
    color: "#134555",
  },
  gate: {
    id: "gate",
    label: "Approval gate",
    filterable: false,
    background: "#f7f4ea",
    border: "#8a7340",
    color: "#4e4120",
  },
};

export const departmentOrder: DepartmentId[] = [
  "merchandising",
  "sample-room",
  "fabric",
  "developing",
  "client",
  "appstreme",
  "warehouse",
  "planning",
  "production",
  "packing",
  "shipping",
];

export const phases: Phase[] = [
  {
    id: "sample-development",
    title: "1 · Sample request and development",
    caption: "Sampling, fabric development and costing overlap.",
    extraTop: 58,
    extraRight: 28,
    extraBottom: 22,
    extraLeft: 40,
  },
  {
    id: "approvals-order",
    title: "2 · Approvals and order entry",
    caption: "Both approvals are required, and the customer must place the order.",
    extraTop: 62,
    extraRight: 28,
    extraBottom: 22,
    extraLeft: 18,
  },
  {
    id: "materials",
    title: "3 · Material requirements and purchasing",
    caption: "Merchandising reviews, approves and purchases.",
    extraTop: 58,
    extraRight: 18,
    extraBottom: 20,
    extraLeft: 18,
  },
  {
    id: "receiving-production",
    title: "4 · Receiving, issuing and production",
    caption: "Each batch is received before issue. A later batch can arrive while an earlier one is in production.",
    extraTop: 72,
    extraRight: 24,
    extraBottom: 22,
    extraLeft: 16,
  },
  {
    id: "route-tracking",
    title: "5 · Production route tracking",
    caption: "The route comes from Sample Room. Final inspection is a stage on that route.",
    extraTop: 58,
    extraRight: 22,
    extraBottom: 68,
    extraLeft: 18,
  },
  {
    id: "packing-shipment",
    title: "6 · Packing and shipment",
    extraTop: 36,
    extraRight: 20,
    extraBottom: 18,
    extraLeft: 16,
  },
];

const parallelDevelopment = "Overlaps other development work";

const positions: Record<ViewId, Record<string, Point>> = {
  all: {
    "create-sample-order": { x: 24, y: 230 },
    "select-sample-type": { x: 320, y: 36 },
    "prep-without-fabric": { x: 616, y: 36 },
    "continue-fabric-sampling": { x: 912, y: 36 },
    "complete-sample": { x: 1208, y: 36 },
    "develop-fabric": { x: 320, y: 230 },
    "create-fabric-record": { x: 616, y: 230 },
    "send-physical-fabric": { x: 912, y: 230 },
    "prepare-costing": { x: 320, y: 430 },
    "approve-costing": { x: 616, y: 430 },
    "define-production-route": { x: 1208, y: 430 },
    "submit-sample": { x: 24, y: 700 },
    "client-approve-sample": { x: 320, y: 700 },
    "approval-gate": { x: 616, y: 700 },
    "receive-development-info": { x: 912, y: 700 },
    "enter-order-details": { x: 1208, y: 700 },
    "create-production-order": { x: 1504, y: 700 },
    "place-customer-order": { x: 1208, y: 890 },
    "calculate-requirements": { x: 24, y: 1120 },
    "review-requirements": { x: 320, y: 1120 },
    "approve-requirements": { x: 616, y: 1120 },
    "purchase-materials": { x: 912, y: 1120 },
    "receive-batches": { x: 1208, y: 1120 },
    "issue-materials": { x: 1504, y: 1120 },
    "produce-with-materials": { x: 1504, y: 1340 },
    "perform-route-stage": { x: 24, y: 1640 },
    "record-manufacture-entry": { x: 320, y: 1640 },
    "continue-next-stage": { x: 616, y: 1640 },
    "final-inspection": { x: 912, y: 1640 },
    "record-inspection-entry": { x: 1208, y: 1640 },
    "create-packing-list": { x: 1208, y: 1900 },
    "complete-shipment": { x: 1504, y: 1900 },
  },
  development: {
    "create-sample-order": { x: 24, y: 210 },
    "select-sample-type": { x: 324, y: 40 },
    "prep-without-fabric": { x: 624, y: 40 },
    "continue-fabric-sampling": { x: 924, y: 40 },
    "complete-sample": { x: 1224, y: 40 },
    "develop-fabric": { x: 324, y: 210 },
    "create-fabric-record": { x: 624, y: 210 },
    "send-physical-fabric": { x: 924, y: 210 },
    "prepare-costing": { x: 324, y: 390 },
    "approve-costing": { x: 624, y: 390 },
    "define-production-route": { x: 1224, y: 390 },
    "submit-sample": { x: 24, y: 570 },
    "client-approve-sample": { x: 324, y: 570 },
    "approval-gate": { x: 624, y: 570 },
    "receive-development-info": { x: 924, y: 570 },
  },
  "order-materials": {
    "approve-costing": { x: 16, y: 196 },
    "client-approve-sample": { x: 280, y: 40 },
    "approval-gate": { x: 560, y: 40 },
    "receive-development-info": { x: 840, y: 40 },
    "enter-order-details": { x: 1120, y: 40 },
    "create-production-order": { x: 1400, y: 40 },
    "place-customer-order": { x: 1120, y: 196 },
    "calculate-requirements": { x: 16, y: 460 },
    "review-requirements": { x: 280, y: 460 },
    "approve-requirements": { x: 560, y: 460 },
    "purchase-materials": { x: 840, y: 460 },
    "receive-batches": { x: 1120, y: 460 },
  },
  "production-shipment": {
    "define-production-route": { x: 48, y: 36 },
    "receive-batches": { x: 340, y: 36 },
    "issue-materials": { x: 630, y: 36 },
    "produce-with-materials": { x: 920, y: 36 },
    "perform-route-stage": { x: 48, y: 250 },
    "record-manufacture-entry": { x: 340, y: 250 },
    "continue-next-stage": { x: 630, y: 250 },
    "final-inspection": { x: 920, y: 250 },
    "record-inspection-entry": { x: 1210, y: 250 },
    "create-packing-list": { x: 1210, y: 470 },
    "complete-shipment": { x: 1500, y: 470 },
  },
};

function placed(id: string, views: ViewId[]): Pick<Activity, "views" | "positions"> {
  const activityPositions: Partial<Record<ViewId, Point>> = {};
  for (const view of views) {
    const point = positions[view][id];
    if (!point) {
      throw new Error(`Missing position for ${id} in ${view}`);
    }
    activityPositions[view] = point;
  }
  return { views, positions: activityPositions };
}

export const activities: Activity[] = [
  {
    id: "create-sample-order",
    title: "Create sample order",
    departmentId: "merchandising",
    phaseId: "sample-development",
    kind: "activity",
    summary: "Merchandising creates a sample order to start development.",
    dataEntered: ["Customer", "Style group", "Tech pack", "Fabric explanation", "Requested sample"],
    outputs: ["Sample request"],
    listOrder: 1,
    ...placed("create-sample-order", ["all", "development"]),
  },
  {
    id: "select-sample-type",
    title: "Select sample type",
    departmentId: "sample-room",
    phaseId: "sample-development",
    kind: "activity",
    summary:
      "Sample Room selects the sample type based on the sample requested by Merchandising, then follows the applicable sampling process.",
    inputs: ["Requested sample"],
    outputs: ["Selected sample type"],
    listOrder: 2,
    parallelGroup: parallelDevelopment,
    ...placed("select-sample-type", ["all", "development"]),
  },
  {
    id: "prep-without-fabric",
    title: "Work without fabric",
    departmentId: "sample-room",
    phaseId: "sample-development",
    kind: "activity",
    summary:
      "Sample Room begins work that does not need fabric. Pattern making is an example. This runs while the Fabric Department develops the fabric.",
    inputs: ["Selected sample type"],
    listOrder: 3,
    parallelGroup: parallelDevelopment,
    ...placed("prep-without-fabric", ["all", "development"]),
  },
  {
    id: "develop-fabric",
    title: "Develop fabric",
    departmentId: "fabric",
    phaseId: "sample-development",
    kind: "activity",
    summary:
      "Fabric Department develops the fabric for the sample. This stays a single activity and does not expand internal fabric manufacturing.",
    inputs: ["Fabric explanation from the sample request"],
    listOrder: 4,
    parallelGroup: parallelDevelopment,
    ...placed("develop-fabric", ["all", "development"]),
  },
  {
    id: "create-fabric-record",
    title: "Create fabric record",
    departmentId: "fabric",
    phaseId: "sample-development",
    kind: "activity",
    summary: "Fabric Department creates the fabric record in Appstreme and assigns a fabric code.",
    outputs: ["Fabric record", "Fabric code"],
    listOrder: 7,
    ...placed("create-fabric-record", ["all", "development"]),
  },
  {
    id: "send-physical-fabric",
    title: "Send physical fabric",
    departmentId: "fabric",
    phaseId: "sample-development",
    kind: "activity",
    summary: "Fabric Department sends the physical fabric to Sample Room.",
    outputs: ["Physical fabric delivered to Sample Room"],
    listOrder: 8,
    ...placed("send-physical-fabric", ["all", "development"]),
  },
  {
    id: "continue-fabric-sampling",
    title: "Fabric-dependent sampling",
    departmentId: "sample-room",
    phaseId: "sample-development",
    kind: "activity",
    summary:
      "Sample Room continues the sampling work that needs fabric. This depends on the preparation work and on receipt of the fabric. Sample Room does not wait for fabric before the work that can start earlier.",
    inputs: ["Preparation that does not need fabric", "Physical fabric", "Fabric record and code"],
    listOrder: 9,
    ...placed("continue-fabric-sampling", ["all", "development"]),
  },
  {
    id: "complete-sample",
    title: "Complete the sample",
    departmentId: "sample-room",
    phaseId: "sample-development",
    kind: "activity",
    summary: "Sample Room completes the sample.",
    outputs: ["Sample details", "Sample timeline"],
    listOrder: 10,
    ...placed("complete-sample", ["all", "development"]),
  },
  {
    id: "define-production-route",
    title: "Define production route",
    departmentId: "sample-room",
    phaseId: "sample-development",
    kind: "activity",
    summary:
      "Sample Room defines the production route during development. The route is part of the development information and is carried onto the production order. Production does not invent the route later.",
    outputs: ["Production route"],
    listOrder: 6,
    parallelGroup: parallelDevelopment,
    ...placed("define-production-route", ["all", "development", "production-shipment"]),
  },
  {
    id: "prepare-costing",
    title: "Prepare costing",
    departmentId: "developing",
    phaseId: "sample-development",
    kind: "activity",
    summary:
      "Developing Department prepares costing alongside sampling. Costing and sampling are linked, parallel activities. Costing is not held until the sample is finished.",
    inputs: ["Sample request"],
    listOrder: 5,
    parallelGroup: parallelDevelopment,
    ...placed("prepare-costing", ["all", "development"]),
  },
  {
    id: "approve-costing",
    title: "Approve costing",
    departmentId: "developing",
    phaseId: "sample-development",
    kind: "activity",
    approval: true,
    summary:
      "Developing Department approves the costing internally. This approval is separate from the client’s sample approval.",
    outputs: ["Approved costing"],
    listOrder: 11,
    ...placed("approve-costing", ["all", "development", "order-materials"]),
  },
  {
    id: "submit-sample",
    title: "Submit sample to client",
    departmentId: "merchandising",
    phaseId: "approvals-order",
    kind: "activity",
    summary: "Merchandising submits the completed sample to the client.",
    inputs: ["Completed sample"],
    listOrder: 12,
    ...placed("submit-sample", ["all", "development"]),
  },
  {
    id: "client-approve-sample",
    title: "Approve the sample",
    departmentId: "client",
    phaseId: "approvals-order",
    kind: "external",
    approval: true,
    summary: "The client approves the sample and sends that approval to Merchandising.",
    inputs: ["Submitted sample"],
    outputs: ["Client sample approval"],
    listOrder: 13,
    ...placed("client-approve-sample", ["all", "development", "order-materials"]),
  },
  {
    id: "approval-gate",
    title: "Both approvals complete?",
    departmentId: "gate",
    phaseId: "approvals-order",
    kind: "gate",
    summary:
      "Client sample approval AND internal costing approval complete? The workflow continues only when both are complete. If either is missing, the gate stays pending. This view has no rejection or rework path. The gate is one prerequisite for order entry. The customer must also place the order.",
    listOrder: 14,
    ...placed("approval-gate", ["all", "development", "order-materials"]),
  },
  {
    id: "receive-development-info",
    title: "Receive development information",
    departmentId: "merchandising",
    phaseId: "approvals-order",
    kind: "activity",
    summary: "Development information returns to Merchandising.",
    inputs: [
      "Sample details",
      "Sample timeline",
      "Fabric record and code",
      "Approved costing",
      "Production route",
    ],
    listOrder: 15,
    ...placed("receive-development-info", ["all", "development", "order-materials"]),
  },
  {
    id: "place-customer-order",
    title: "Place customer order",
    departmentId: "client",
    phaseId: "approvals-order",
    kind: "external",
    summary:
      "The client places the customer order. Order entry needs this order as well as the completed approval gate.",
    outputs: ["Customer order"],
    listOrder: 16,
    ...placed("place-customer-order", ["all", "order-materials"]),
  },
  {
    id: "enter-order-details",
    title: "Enter style and order",
    departmentId: "merchandising",
    phaseId: "approvals-order",
    kind: "activity",
    summary:
      "After the approvals and receipt of the customer order, Merchandising completes the style details and enters the customer order details.",
    inputs: ["Development information", "Customer order", "Both approvals complete"],
    dataEntered: ["Order quantity", "Colour and size breakdown", "Delivery date", "Destinations"],
    listOrder: 17,
    ...placed("enter-order-details", ["all", "order-materials"]),
  },
  {
    id: "create-production-order",
    title: "Create production order",
    departmentId: "appstreme",
    phaseId: "approvals-order",
    kind: "automatic",
    summary:
      "Appstreme automatically creates the production order from the completed style and customer order information. There is no separate manual step to create the production order.",
    inputs: [
      "Development information",
      "Completed style details",
      "Customer order details",
      "Production route defined by Sample Room",
    ],
    outputs: ["Production order"],
    listOrder: 18,
    ...placed("create-production-order", ["all", "order-materials"]),
  },
  {
    id: "calculate-requirements",
    title: "Calculate requirements",
    departmentId: "appstreme",
    phaseId: "materials",
    kind: "automatic",
    summary:
      "Appstreme automatically calculates material requirements for fabric, trims and packaging. Illustrative calculation: consumption × order quantity + wastage allowance − available stock. The result is the purchase shortage, and it is not shown as a negative quantity. This is explanatory logic, not a live inventory calculation.",
    inputs: ["Production order"],
    outputs: ["Purchase shortage for fabric, trims and packaging"],
    listOrder: 19,
    ...placed("calculate-requirements", ["all", "order-materials"]),
  },
  {
    id: "review-requirements",
    title: "Review requirements",
    departmentId: "merchandising",
    phaseId: "materials",
    kind: "activity",
    summary: "Merchandising reviews the calculated requirements.",
    inputs: ["Calculated material requirements"],
    listOrder: 20,
    ...placed("review-requirements", ["all", "order-materials"]),
  },
  {
    id: "approve-requirements",
    title: "Approve requirements",
    departmentId: "merchandising",
    phaseId: "materials",
    kind: "activity",
    approval: true,
    summary: "Merchandising approves the requirements internally.",
    outputs: ["Approved material requirements"],
    listOrder: 21,
    ...placed("approve-requirements", ["all", "order-materials"]),
  },
  {
    id: "purchase-materials",
    title: "Purchase materials",
    departmentId: "merchandising",
    phaseId: "materials",
    kind: "activity",
    summary:
      "Merchandising purchases the required materials. Review, internal approval and purchasing all stay with Merchandising.",
    inputs: ["Approved material requirements"],
    outputs: ["Purchased materials"],
    listOrder: 22,
    ...placed("purchase-materials", ["all", "order-materials"]),
  },
  {
    id: "receive-batches",
    title: "Receive material batches",
    departmentId: "warehouse",
    phaseId: "receiving-production",
    kind: "activity",
    summary:
      "Warehouse receives materials in batches. Further batches can arrive while earlier batches are already issued or in production. There is no gate that waits for every material.",
    inputs: ["Purchased materials"],
    outputs: ["Received batches"],
    listOrder: 23,
    ...placed("receive-batches", ["all", "order-materials", "production-shipment"]),
  },
  {
    id: "issue-materials",
    title: "Issue available materials",
    departmentId: "planning",
    phaseId: "receiving-production",
    kind: "activity",
    summary:
      "Planning issues available materials to Production. Planning owns issuing. Warehouse does not. A batch can be issued only after Warehouse has received it.",
    inputs: ["Received batches"],
    outputs: ["Issued materials"],
    listOrder: 24,
    ...placed("issue-materials", ["all", "production-shipment"]),
  },
  {
    id: "produce-with-materials",
    title: "Produce with issued materials",
    departmentId: "production",
    phaseId: "receiving-production",
    kind: "activity",
    summary:
      "Production starts or continues with the materials Planning has issued. Warehouse can receive another batch while this continues.",
    inputs: ["Issued materials"],
    listOrder: 25,
    ...placed("produce-with-materials", ["all", "production-shipment"]),
  },
  {
    id: "perform-route-stage",
    title: "Perform route stage",
    departmentId: "production",
    phaseId: "route-tracking",
    kind: "activity",
    summary:
      "Production performs the current stage on the route defined by Sample Room. Production does not create that route.",
    inputs: ["Production route defined by Sample Room", "Production order"],
    listOrder: 26,
    ...placed("perform-route-stage", ["all", "production-shipment"]),
  },
  {
    id: "record-manufacture-entry",
    title: "Record manufacture entry",
    departmentId: "production",
    phaseId: "route-tracking",
    kind: "activity",
    summary:
      "Production staff record a Manual Order Manufacture Entry for the stage. The customer determines quality grades and defect criteria.",
    dataEntered: [
      "Completed quantity",
      "First-quality quantity",
      "Second-quality quantity",
      "Defects",
    ],
    outputs: ["Stage result"],
    listOrder: 27,
    ...placed("record-manufacture-entry", ["all", "production-shipment"]),
  },
  {
    id: "continue-next-stage",
    title: "Continue to next stage",
    departmentId: "production",
    phaseId: "route-tracking",
    kind: "activity",
    summary:
      "Production continues to the next stage on the route. The stage and the manual entry repeat for each remaining stage. The return arrow is that repetition. It is not a live order running on its own.",
    inputs: ["Recorded stage result"],
    listOrder: 28,
    ...placed("continue-next-stage", ["all", "production-shipment"]),
  },
  {
    id: "final-inspection",
    title: "Final inspection",
    departmentId: "production",
    phaseId: "route-tracking",
    kind: "activity",
    summary:
      "Final inspection is a stage on the production route. It is tracked with the route, not as an activity outside it.",
    inputs: ["Production route"],
    listOrder: 29,
    ...placed("final-inspection", ["all", "production-shipment"]),
  },
  {
    id: "record-inspection-entry",
    title: "Record inspection entry",
    departmentId: "production",
    phaseId: "route-tracking",
    kind: "activity",
    summary:
      "The final inspection result is recorded with a Manual Order Manufacture Entry. The customer determines quality grades and defect criteria.",
    dataEntered: [
      "Completed quantity",
      "First-quality quantity",
      "Second-quality quantity",
      "Defects",
    ],
    outputs: ["Inspection result"],
    listOrder: 30,
    ...placed("record-inspection-entry", ["all", "production-shipment"]),
  },
  {
    id: "create-packing-list",
    title: "Create packing list",
    departmentId: "packing",
    phaseId: "packing-shipment",
    kind: "activity",
    summary: "Packing Department creates the packing list.",
    outputs: ["Packing list"],
    listOrder: 31,
    ...placed("create-packing-list", ["all", "production-shipment"]),
  },
  {
    id: "complete-shipment",
    title: "Complete shipment",
    departmentId: "shipping",
    phaseId: "packing-shipment",
    kind: "activity",
    summary: "Shipping Department completes the shipment.",
    inputs: ["Packing list"],
    outputs: ["Shipment"],
    listOrder: 32,
    ...placed("complete-shipment", ["all", "production-shipment"]),
  },
];

export const edges: WorkflowEdge[] = [
  {
    id: "e-create-to-select",
    source: "create-sample-order",
    target: "select-sample-type",
    kind: "progression",
    label: "Sample request",
    sourceSide: "top",
    targetSide: "bottom",
    via: {
      all: [
        { x: 138, y: 175 },
        { x: 434, y: 175 },
      ],
      development: [
        { x: 138, y: 168 },
        { x: 438, y: 168 },
      ],
    },
  },
  {
    id: "e-create-to-develop",
    source: "create-sample-order",
    target: "develop-fabric",
    kind: "information",
    label: "Sample request",
    sourceSide: "right",
    targetSide: "left",
    labelAt: {
      all: { x: 286, y: 200 },
      development: { x: 288, y: 168 },
    },
  },
  {
    id: "e-create-to-costing",
    source: "create-sample-order",
    target: "prepare-costing",
    kind: "information",
    label: "Alongside sampling",
    sourceSide: "bottom",
    targetSide: "top",
    via: {
      all: [
        { x: 138, y: 372 },
        { x: 434, y: 372 },
      ],
      development: [
        { x: 138, y: 348 },
        { x: 438, y: 348 },
      ],
    },
  },
  {
    id: "e-select-to-prep",
    source: "select-sample-type",
    target: "prep-without-fabric",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-select-to-route",
    source: "select-sample-type",
    target: "define-production-route",
    kind: "progression",
    label: "During development",
    sourceSide: "bottom",
    targetSide: "top",
    via: {
      all: [
        { x: 434, y: 175 },
        { x: 1322, y: 175 },
      ],
      development: [
        { x: 438, y: 168 },
        { x: 1338, y: 168 },
      ],
    },
  },
  {
    id: "e-prep-to-continue",
    source: "prep-without-fabric",
    target: "continue-fabric-sampling",
    kind: "progression",
    label: "Preparation ready",
    sourceSide: "right",
    targetSide: "left",
    labelAt: {
      all: { x: 878, y: 152 },
      development: { x: 888, y: 156 },
    },
  },
  {
    id: "e-develop-to-record",
    source: "develop-fabric",
    target: "create-fabric-record",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-record-to-send",
    source: "create-fabric-record",
    target: "send-physical-fabric",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-record-to-continue",
    source: "create-fabric-record",
    target: "continue-fabric-sampling",
    kind: "information",
    label: "Fabric record and code",
    sourceSide: "bottom",
    targetSide: "top",
    via: {
      all: [
        { x: 730, y: 372 },
        { x: 1174, y: 372 },
        { x: 1174, y: 16 },
        { x: 1026, y: 16 },
      ],
      development: [
        { x: 738, y: 348 },
        { x: 888, y: 348 },
        { x: 888, y: 16 },
        { x: 1038, y: 16 },
      ],
    },
  },
  {
    id: "e-send-to-continue",
    source: "send-physical-fabric",
    target: "continue-fabric-sampling",
    kind: "material",
    label: "Fabric delivered.",
    sourceSide: "top",
    targetSide: "bottom",
  },
  {
    id: "e-continue-to-complete",
    source: "continue-fabric-sampling",
    target: "complete-sample",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-costing-to-approve",
    source: "prepare-costing",
    target: "approve-costing",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-complete-to-submit",
    source: "complete-sample",
    target: "submit-sample",
    kind: "progression",
    sourceSide: "right",
    targetSide: "top",
    sides: {
      development: { sourceSide: "bottom", targetSide: "top" },
    },
    via: {
      all: [
        { x: 1472, y: 78 },
        { x: 1472, y: 620 },
        { x: 138, y: 620 },
      ],
      development: [
        { x: 1338, y: 140 },
        { x: 1176, y: 140 },
        { x: 1176, y: 530 },
        { x: 138, y: 530 },
      ],
    },
  },
  {
    id: "e-submit-to-client",
    source: "submit-sample",
    target: "client-approve-sample",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-client-to-gate",
    source: "client-approve-sample",
    target: "approval-gate",
    kind: "approval",
    label: "Client sample approval",
    sourceSide: "right",
    targetSide: "left",
    labelAt: {
      all: { x: 582, y: 820 },
      development: { x: 588, y: 688 },
      "order-materials": { x: 534, y: 156 },
    },
  },
  {
    id: "e-approve-to-gate",
    source: "approve-costing",
    target: "approval-gate",
    kind: "approval",
    label: "Internal costing approval",
    sourceSide: "bottom",
    targetSide: "top",
    sides: {
      "order-materials": { sourceSide: "top", targetSide: "bottom" },
    },
    via: {
      "order-materials": [
        { x: 130, y: 160 },
        { x: 674, y: 160 },
      ],
    },
  },
  {
    id: "e-gate-to-devinfo",
    source: "approval-gate",
    target: "receive-development-info",
    kind: "progression",
    label: "When both are complete",
    sourceSide: "right",
    targetSide: "left",
    labelAt: {
      all: { x: 878, y: 820 },
      development: { x: 888, y: 688 },
      "order-materials": { x: 814, y: 156 },
    },
  },
  {
    id: "e-complete-to-devinfo",
    source: "complete-sample",
    target: "receive-development-info",
    kind: "information",
    label: "Sample details and timeline",
    sourceSide: "right",
    targetSide: "top",
    sides: {
      development: { sourceSide: "bottom", targetSide: "top" },
    },
    via: {
      all: [
        { x: 1520, y: 78 },
        { x: 1520, y: 656 },
        { x: 1026, y: 656 },
      ],
      development: [
        { x: 1338, y: 156 },
        { x: 1198, y: 156 },
        { x: 1198, y: 510 },
        { x: 1038, y: 510 },
      ],
    },
  },
  {
    id: "e-record-to-devinfo",
    source: "create-fabric-record",
    target: "receive-development-info",
    kind: "information",
    label: "Fabric record and code",
    sourceSide: "bottom",
    targetSide: "top",
    via: {
      all: [
        { x: 730, y: 372 },
        { x: 1560, y: 372 },
        { x: 1560, y: 656 },
        { x: 1026, y: 656 },
      ],
      development: [
        { x: 738, y: 348 },
        { x: 888, y: 348 },
        { x: 888, y: 510 },
        { x: 1038, y: 510 },
      ],
    },
    labelAt: {
      development: { x: 813, y: 348 },
    },
  },
  {
    id: "e-approve-to-devinfo",
    source: "approve-costing",
    target: "receive-development-info",
    kind: "information",
    label: "Approved costing",
    sourceSide: "right",
    targetSide: "top",
    sides: {
      "order-materials": { sourceSide: "bottom", targetSide: "bottom" },
    },
    via: {
      all: [
        { x: 878, y: 472 },
        { x: 878, y: 656 },
        { x: 1026, y: 656 },
      ],
      development: [
        { x: 888, y: 432 },
        { x: 888, y: 510 },
        { x: 1038, y: 510 },
      ],
      "order-materials": [
        { x: 130, y: 340 },
        { x: 954, y: 340 },
      ],
    },
  },
  {
    id: "e-route-to-devinfo",
    source: "define-production-route",
    target: "receive-development-info",
    kind: "information",
    label: "Production route",
    sourceSide: "bottom",
    targetSide: "top",
    via: {
      all: [
        { x: 1322, y: 656 },
        { x: 1026, y: 656 },
      ],
      development: [
        { x: 1338, y: 510 },
        { x: 1038, y: 510 },
      ],
    },
  },
  {
    id: "e-devinfo-to-enter",
    source: "receive-development-info",
    target: "enter-order-details",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-place-to-enter",
    source: "place-customer-order",
    target: "enter-order-details",
    kind: "progression",
    label: "Customer order",
    sourceSide: "top",
    targetSide: "bottom",
  },
  {
    id: "e-enter-to-po",
    source: "enter-order-details",
    target: "create-production-order",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-po-to-calc",
    source: "create-production-order",
    target: "calculate-requirements",
    kind: "progression",
    sourceSide: "bottom",
    targetSide: "top",
    via: {
      all: [
        { x: 1618, y: 1050 },
        { x: 138, y: 1050 },
      ],
      "order-materials": [
        { x: 1514, y: 370 },
        { x: 130, y: 370 },
      ],
    },
  },
  {
    id: "e-calc-to-review",
    source: "calculate-requirements",
    target: "review-requirements",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-review-to-approve-req",
    source: "review-requirements",
    target: "approve-requirements",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-approve-req-to-purchase",
    source: "approve-requirements",
    target: "purchase-materials",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-purchase-to-receive",
    source: "purchase-materials",
    target: "receive-batches",
    kind: "material",
    label: "Materials delivered.",
    sourceSide: "right",
    targetSide: "left",
    labelAt: {
      all: { x: 1174, y: 1236 },
      "order-materials": { x: 1094, y: 572 },
    },
  },
  {
    id: "e-receive-to-issue",
    source: "receive-batches",
    target: "issue-materials",
    kind: "progression",
    label: "Available to issue",
    sourceSide: "right",
    targetSide: "left",
    labelAt: {
      all: { x: 1470, y: 1236 },
      "production-shipment": { x: 599, y: 156 },
    },
  },
  {
    id: "e-issue-to-produce",
    source: "issue-materials",
    target: "produce-with-materials",
    kind: "material",
    label: "Materials issued.",
    sourceSide: "bottom",
    targetSide: "top",
    sides: {
      "production-shipment": { sourceSide: "right", targetSide: "left" },
    },
    labelAt: {
      "production-shipment": { x: 889, y: 156 },
    },
  },
  {
    id: "e-produce-to-perform",
    source: "produce-with-materials",
    target: "perform-route-stage",
    kind: "progression",
    sourceSide: "bottom",
    targetSide: "top",
    via: {
      all: [
        { x: 1618, y: 1530 },
        { x: 138, y: 1530 },
      ],
      "production-shipment": [
        { x: 1034, y: 190 },
        { x: 162, y: 190 },
      ],
    },
  },
  {
    id: "e-route-to-perform",
    source: "define-production-route",
    target: "perform-route-stage",
    kind: "information",
    label: "Production route",
    sourceSide: "left",
    targetSide: "left",
    views: ["production-shipment"],
    via: {
      "production-shipment": [
        { x: 28, y: 78 },
        { x: 28, y: 292 },
      ],
    },
  },
  {
    id: "e-perform-to-record",
    source: "perform-route-stage",
    target: "record-manufacture-entry",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-record-to-next",
    source: "record-manufacture-entry",
    target: "continue-next-stage",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-next-to-perform",
    source: "continue-next-stage",
    target: "perform-route-stage",
    kind: "progression",
    label: "Repeat for each remaining stage",
    sourceSide: "bottom",
    targetSide: "bottom",
    via: {
      all: [
        { x: 730, y: 1780 },
        { x: 138, y: 1780 },
      ],
      "production-shipment": [
        { x: 744, y: 400 },
        { x: 162, y: 400 },
      ],
    },
  },
  {
    id: "e-next-to-inspect",
    source: "continue-next-stage",
    target: "final-inspection",
    kind: "progression",
    label: "Final inspection stage",
    sourceSide: "right",
    targetSide: "left",
    labelAt: {
      all: { x: 878, y: 1752 },
      "production-shipment": { x: 889, y: 366 },
    },
  },
  {
    id: "e-inspect-to-record",
    source: "final-inspection",
    target: "record-inspection-entry",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
  {
    id: "e-record-inspection-to-pack",
    source: "record-inspection-entry",
    target: "create-packing-list",
    kind: "progression",
    sourceSide: "bottom",
    targetSide: "top",
  },
  {
    id: "e-pack-to-ship",
    source: "create-packing-list",
    target: "complete-shipment",
    kind: "progression",
    sourceSide: "right",
    targetSide: "left",
  },
];

export const approvalPathNodeIds = [
  "approval-gate",
  "receive-development-info",
  "enter-order-details",
] as const;

export const approvalPathEdgeIds = ["e-gate-to-devinfo", "e-devinfo-to-enter"] as const;

export const batchActivityIds = [
  "receive-batches",
  "issue-materials",
  "produce-with-materials",
] as const;

export const walkthrough: WalkthroughStep[] = [
  {
    id: "sample-request",
    title: "Sample request",
    body: "Merchandising creates a sample order. The request goes to the Sample Room and the Fabric Department. Developing prepares costing alongside sampling.",
    nodeIds: ["create-sample-order"],
  },
  {
    id: "parallel-development",
    title: "Parallel development",
    body: "These activities overlap. Sample Room can start work that does not need fabric while Fabric develops the fabric and Developing prepares costing. Sample Room also defines the production route during development. They are not one sequence.",
    nodeIds: [
      "select-sample-type",
      "prep-without-fabric",
      "develop-fabric",
      "prepare-costing",
      "define-production-route",
    ],
  },
  {
    id: "fabric-handover",
    title: "Fabric record and delivery",
    body: "Fabric Department creates the fabric record and code, then sends the physical fabric. Fabric-dependent sampling waits for that delivery and for the preparation work. Earlier Sample Room work does not wait for fabric.",
    nodeIds: ["create-fabric-record", "send-physical-fabric", "continue-fabric-sampling"],
  },
  {
    id: "sample-complete",
    title: "Sample completed",
    body: "Sample Room completes the sample. The outputs are the sample details and the sample timeline.",
    nodeIds: ["complete-sample"],
  },
  {
    id: "separate-approvals",
    title: "Two separate approvals",
    body: "Merchandising submits the sample to the client. The client approves the sample. Developing approves costing internally. These are separate approvals.",
    nodeIds: ["submit-sample", "client-approve-sample", "approve-costing"],
  },
  {
    id: "approval-gate",
    title: "Approval gate",
    body: "Both the client sample approval and the internal costing approval are required. Use the illustrative demo: one approval stays pending, and both open the path toward order entry. The customer must also place the order before order entry proceeds.",
    nodeIds: ["approval-gate"],
  },
  {
    id: "development-returns",
    title: "Development information returns",
    body: "Merchandising receives the sample details, sample timeline, fabric record and code, approved costing, and the production route defined by Sample Room.",
    nodeIds: [
      "receive-development-info",
      "complete-sample",
      "create-fabric-record",
      "approve-costing",
      "define-production-route",
    ],
  },
  {
    id: "order-entry",
    title: "Customer order and style details",
    body: "After the approvals and the customer order, Merchandising completes the style details and enters quantity, colour and size breakdown, delivery date and destinations.",
    nodeIds: ["place-customer-order", "enter-order-details"],
  },
  {
    id: "auto-order",
    title: "Automatic production order",
    body: "Appstreme creates the production order automatically. There is no separate manual step. The order uses the development information, completed style details, customer order details and the Sample Room production route.",
    nodeIds: ["create-production-order"],
  },
  {
    id: "materials",
    title: "Requirements and purchasing",
    body: "Appstreme calculates the purchase shortage for fabric, trims and packaging. Merchandising reviews the requirements, approves them internally and purchases the materials.",
    nodeIds: [
      "calculate-requirements",
      "review-requirements",
      "approve-requirements",
      "purchase-materials",
    ],
  },
  {
    id: "batches",
    title: "Batches overlap",
    body: "Warehouse receives materials in batches. Planning issues what is available. Production can continue while Warehouse receives another batch. A batch must be received before Planning can issue it. Use the illustrative batch demo.",
    nodeIds: ["receive-batches", "issue-materials", "produce-with-materials"],
  },
  {
    id: "route-entries",
    title: "Route stages and manual entries",
    body: "Production follows the route defined by Sample Room. At each stage, staff record a Manual Order Manufacture Entry: completed quantity, first-quality quantity, second-quality quantity and defects. The cycle repeats for each stage on the route.",
    nodeIds: ["perform-route-stage", "record-manufacture-entry", "continue-next-stage"],
  },
  {
    id: "inspection",
    title: "Final inspection on the route",
    body: "Final inspection is a stage on the production route. Its result is recorded with a Manual Order Manufacture Entry, not as an untracked step outside the route.",
    nodeIds: ["final-inspection", "record-inspection-entry"],
  },
  {
    id: "ship",
    title: "Packing and shipment",
    body: "Packing Department creates the packing list. Shipping Department completes the shipment. They are separate responsibilities.",
    nodeIds: ["create-packing-list", "complete-shipment"],
  },
];

const activityMap = new Map(activities.map((activity) => [activity.id, activity]));

export function getActivity(id: string): Activity {
  const activity = activityMap.get(id);
  if (!activity) {
    throw new Error(`Unknown activity ${id}`);
  }
  return activity;
}

export function activitiesInView(view: ViewId): Activity[] {
  return activities.filter((activity) => activity.views.includes(view));
}

export function edgesInView(view: ViewId): WorkflowEdge[] {
  const ids = new Set(activitiesInView(view).map((activity) => activity.id));
  return edges.filter(
    (edge) =>
      ids.has(edge.source) && ids.has(edge.target) && (!edge.views || edge.views.includes(view)),
  );
}

export function edgeRoute(edge: WorkflowEdge, view: ViewId): {
  sourceSide: Side;
  targetSide: Side;
  via: Point[];
} {
  const override = edge.sides?.[view];
  return {
    sourceSide: override?.sourceSide ?? edge.sourceSide,
    targetSide: override?.targetSide ?? edge.targetSide,
    via: edge.via?.[view] ?? [],
  };
}

export function viewContaining(activity: Activity, preferred: ViewId): ViewId {
  if (activity.views.includes(preferred)) {
    return preferred;
  }
  return activity.views.find((view) => view !== "all") ?? "all";
}

export const edgeKindLabel: Record<EdgeKind, string> = {
  progression: "Workflow progression",
  information: "Information handover",
  material: "Physical material transfer",
  approval: "Approval dependency",
};
