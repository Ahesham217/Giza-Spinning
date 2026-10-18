# Appstreme Factory Workflow

Training page for a garment factory process, from sample request to shipment. It shows who does each activity, what they enter, what moves between departments, which work runs in parallel, and how approvals, material batches and production stages progress.

This is a frontend only. There is no database, account system or connection to a live Appstreme installation. Approval and batch controls are illustrative and stay in the browser.

Workflow content — activities, edges, phases, departments and the walkthrough — is defined in [`src/data/workflow.ts`](src/data/workflow.ts). The diagram, details panel, department filter and walkthrough all read from that file.

## Commands

```bash
npm install
npm run dev
npm run build
npm test
```

`npm run dev` starts the local Vite site. `npm run build` typechecks and writes a static build to `dist`. `npm test` checks the approval gate and batch rules, plus the workflow graph.
