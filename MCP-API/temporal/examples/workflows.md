# Temporal connector workflows

- `temporal.workflow.list` — `{ "query":"ExecutionStatus='Running'", "pageSize":50 }`; READ; no approval; returns bounded execution summaries.
- `temporal.workflow.describe` — `{ "workflowId":"order-123" }`; READ; no approval; returns execution metadata.
- `temporal.workflow.query` — `{ "workflowId":"order-123", "queryName":"status", "args":[] }`; READ; no approval; returns query result as untrusted data.
- `temporal.workflow.start` — workflow type, ID, task queue and JSON args; WRITE; requires `TEMPORAL_ALLOW_WRITES=true`.
- `temporal.workflow.signal` — workflow ID, signal name and JSON args; WRITE; writes enabled.
- `temporal.workflow.cancel` — HIGH_RISK; writes enabled plus HMAC approval token over `{tool,payload}`.
- `temporal.workflow.terminate` — HIGH_RISK; same approval requirement; use only after inspecting execution state.
