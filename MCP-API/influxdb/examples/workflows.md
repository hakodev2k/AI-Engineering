# InfluxDB MCP connector examples

## Inspect schema

Tool: `influxdb.table.list`

```json
{"database":"telemetry"}
```

Permission: READ. Approval: no.

Then call `influxdb.table.describe` with `{"database":"telemetry","table":"cpu"}`.

## Query recent data

Tool: `influxdb.query.sql`

```json
{"database":"telemetry","query":"SELECT * FROM cpu WHERE time > now() - INTERVAL '15 minutes'","maxRows":200,"format":"json"}
```

Permission: READ. Approval: no. The official upstream MCP enforces read-only SQL for this tool.

## Write telemetry

Tool: `influxdb.data.write`

```json
{"database":"telemetry","data":"temperature,room=lab value=22.4","precision":"second","approvalId":"<64-char approval digest>"}
```

Permission: WRITE. Approval: required.

## Delete a database

Tool: `influxdb.database.delete`

```json
{"name":"temporary-test-db","approvalId":"<64-char approval digest>"}
```

Permission: DESTRUCTIVE. Strong explicit approval required. This operation is irreversible.
