# Prefect connector workflows

## Inspect recent runs

Tool: `prefect.flow_run.list`

```json
{
  "flow_runs": {
    "state": { "type": { "any_": ["FAILED", "CRASHED"] } }
  },
  "limit": 25,
  "offset": 0
}
```

Permission: READ. Approval: no. Expected output: `{ provider, untrusted_provider_data, result: FlowRun[] }`.

## Inspect worker health

Tool: `prefect.worker.list`

```json
{
  "work_pool_name": "production-workers",
  "limit": 50,
  "offset": 0
}
```

Permission: READ. Approval: no. Expected output includes worker heartbeat/status records returned by Prefect.

## Trigger a deployment

Tool: `prefect.deployment.run`

```json
{
  "deployment_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "parameters": { "date": "2026-09-09" },
  "idempotency_key": "daily-import-2026-09-09",
  "approval_token": "<payload-bound HMAC from trusted approval layer>"
}
```

Permission: HIGH_RISK. Approval: explicit human approval and `PREFECT_ENABLE_HIGH_RISK=true`. The `idempotency_key` reduces duplicate creation risk for retries initiated outside the connector.

## Cancel a flow run

Tool: `prefect.flow_run.cancel`

```json
{
  "flow_run_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "reason": "Operator approved cancellation after upstream data validation failed",
  "approval_token": "<payload-bound HMAC from trusted approval layer>"
}
```

Permission: HIGH_RISK. Approval: explicit human approval. The connector sends a `CANCELLING` state request once and never retries it blindly.
