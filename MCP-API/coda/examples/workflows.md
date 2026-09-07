# Coda connector workflows

## Inspect a project tracker
1. `coda.doc.list` input: `{ "query": "Launch" }` — READ, no approval.
2. `coda.table.list` input: `{ "docId": "AbCDeFGH" }` — READ, no approval.
3. `coda.row.list` input: `{ "docId": "AbCDeFGH", "tableIdOrName": "grid-pqRst-U", "limit": 50 }` — READ, no approval.
Expected output shape: `{ "data": { "items": [...], "nextPageToken"?: "..." }, "meta": { "status": 200, "source": "untrusted_provider_data" } }`.

## Prepare then execute a row update
First read the row with `coda.row.get`. After a human reviews the target and values, call `coda.row.update` with `docId`, `tableIdOrName`, `rowIdOrName`, `cells`, and `approvalToken`. Permission: WRITE. Approval: required. The provider normally returns HTTP 202 with a request ID because updates are queued.

## Trigger an automation
Read the relevant doc/table first and explain the intended effect. After explicit approval, call `coda.automation.trigger` with the known `ruleId`. Permission: WRITE. Risk: HIGH_RISK because the Coda automation may invoke external actions. Approval: required, and `CODA_ALLOW_HIGH_RISK=true` must be configured.
