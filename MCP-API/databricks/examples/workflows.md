# Databricks connector workflows

## Inspect compute before taking action

Tool: `databricks.cluster.list`  
Permission: `READ`  
Approval: no

```json
{
  "page_size": 20
}
```

Then use `databricks.cluster.get` with a returned `cluster_id` to inspect state and configuration.

## Start a known job safely

Tool: `databricks.job.run.start`  
Permission: `HIGH_RISK`  
Approval: required

```json
{
  "job_id": 42,
  "job_parameters": {
    "environment": "staging",
    "date": "2026-08-28"
  },
  "idempotency_token": "daily-staging-2026-08-28",
  "approval_token": "<HMAC-SHA256 approval for this exact payload>"
}
```

Expected output contains a Databricks `run_id`. Follow with `databricks.job.run.get`.

## Execute bounded parameterized SQL

Tool: `databricks.sql.statement.execute`  
Permission: `HIGH_RISK`  
Approval: required

```json
{
  "warehouse_id": "warehouse-id",
  "catalog": "analytics",
  "schema": "reporting",
  "statement": "SELECT order_id, total FROM orders WHERE order_date = :run_date ORDER BY total DESC LIMIT 100",
  "parameters": [
    {
      "name": "run_date",
      "value": "2026-08-27",
      "type": "DATE"
    }
  ],
  "row_limit": 100,
  "byte_limit": 1048576,
  "wait_timeout": "10s",
  "on_wait_timeout": "CONTINUE",
  "approval_token": "<HMAC-SHA256 approval for this exact payload>"
}
```

The connector forces `INLINE` + `JSON_ARRAY` results and never requests external result links.

## Stop an idle warehouse

Tool: `databricks.warehouse.stop`  
Permission: `HIGH_RISK`  
Approval: required

```json
{
  "warehouse_id": "warehouse-id",
  "approval_token": "<HMAC-SHA256 approval for this exact payload>"
}
```

## Cancel a run

Tool: `databricks.job.run.cancel`  
Permission: `HIGH_RISK`  
Approval: required  
Deployment gate: `DATABRICKS_ENABLE_JOB_CANCEL=true`

```json
{
  "run_id": 123456,
  "approval_token": "<HMAC-SHA256 approval for this exact payload>"
}
```
