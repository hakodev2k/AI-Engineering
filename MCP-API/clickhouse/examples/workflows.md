# ClickHouse MCP workflow examples

## Inspect analytics data

Tool: `clickhouse.table.list`

Input:
```json
{"database":"analytics"}
```
Expected output shape: JSON array of visible table names. Permission: READ. Approval: no.

Tool: `clickhouse.table.describe`

Input:
```json
{"table":"analytics.events"}
```
Expected output shape: JSON array of column metadata. Permission: READ. Approval: no.

Tool: `clickhouse.query.readonly`

Input:
```json
{"sql":"SELECT event_type, count() AS n FROM analytics.events GROUP BY event_type ORDER BY n DESC","limit":100}
```
Expected output shape: bounded JSON row array. Permission: READ. Approval: no.

## Insert curated rows

Tool: `clickhouse.table.insert`

Input:
```json
{"table":"analytics.agent_events","rows":[{"event":"reviewed","score":0.91}],"approved":true}
```
Expected output shape: `{ "inserted": 1 }`. Permission: WRITE. Approval: required unless the operator explicitly enables writes.

## Create a controlled table

Tool: `clickhouse.table.create`

Input:
```json
{"table":"analytics.agent_events","columns":[{"name":"event","type":"String"},{"name":"created_at","type":"DateTime"}],"orderBy":["created_at"],"approved":true}
```
Expected output shape: `{ "created": "analytics.agent_events" }`. Permission: HIGH_RISK. Approval: explicit.

## Destructive operation

Tool: `clickhouse.table.drop`

Input:
```json
{"table":"analytics.agent_events","approved":true}
```
Expected output shape: `{ "dropped": "analytics.agent_events" }`. Permission: DESTRUCTIVE. Approval: explicit and `CLICKHOUSE_ALLOW_DESTRUCTIVE=true`; disabled otherwise.
