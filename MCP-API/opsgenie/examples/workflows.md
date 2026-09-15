# Workflow examples

All examples are MCP tool calls; credentials stay in the connector process.

1. `opsgenie.alert.list` — input `{ "query": "status:open AND priority:P1", "limit": 20 }`; READ; no approval. Output contains the upstream `data`, HTTP status, and rate-limit state.
2. `opsgenie.schedule.oncall.get` — input `{ "identifier": "Primary", "identifierType": "name", "flat": true }`; READ; no approval.
3. `opsgenie.alert.note.add` — input `{ "identifier": "<alert-id>", "note": "Investigating database saturation", "approval": true }`; WRITE; approval required.
4. `opsgenie.alert.create` — input `{ "message": "Checkout error rate above threshold", "priority": "P1", "source": "ai-ops", "approval": true }`; HIGH_RISK; requires `OPSGENIE_ENABLE_HIGH_RISK=true` and explicit approval. Returns an asynchronous request ID when accepted.
5. `opsgenie.alert.close` — input `{ "identifier": "<alert-id>", "note": "Service recovered and metrics stable", "approval": true }`; HIGH_RISK; never automatically retried.
