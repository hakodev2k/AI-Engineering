# Workflow examples

## Diagnose a failed pipeline

1. `airflow.dag_run.list` — `{ "dag_id": "orders", "limit": 20, "offset": 0 }` — READ, no approval.
2. `airflow.task_instance.list` — `{ "dag_id": "orders", "dag_run_id": "...", "limit": 100, "offset": 0 }` — READ, no approval.
3. `airflow.task_log.read` — `{ "dag_id": "orders", "dag_run_id": "...", "task_id": "load", "try_number": 1, "full_content": true }` — READ, no approval.

Expected output is an MCP text result containing JSON `{ "ok": true, "risk": "READ", "data": ... }`.

## Trigger an approved run

Tool: `airflow.dag_run.trigger`

Input: `{ "dag_id": "orders", "conf": { "date": "2026-09-24" }, "approval_token": "<out-of-band approval token>" }`

Permission: WRITE. Approval: required. `AIRFLOW_ALLOW_WRITE=true` and an exact match with connector-side `AIRFLOW_APPROVAL_TOKEN` are both required. The approval token is removed before the request is sent to Airflow.
