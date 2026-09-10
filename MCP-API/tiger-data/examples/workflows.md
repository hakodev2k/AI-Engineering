# Tiger Data connector workflows

These examples use the stable connector tool names. Exact provider arguments are sourced from the installed official `tiger mcp start` server at runtime; inspect `tools/list` for the current schema.

## Inspect a service

Tool: `tigerdata.service.list`

Input:

```json
{}
```

Permission: `READ`  
Approval: no

Expected output shape:

```json
{
  "untrustedProviderData": true,
  "data": "<official Tiger MCP result with sensitive credential fields redacted>"
}
```

Then call `tigerdata.service.get` with the service identifier returned by the provider.

## Inspect database schema

Tool: `tigerdata.database.schema`

Typical input:

```json
{
  "service_id": "service-id"
}
```

Permission: `READ`  
Approval: no

The exact identifier field spelling is inherited from the current official Tiger MCP schema.

## Read-only query

Tool: `tigerdata.database.query.read`

Typical input:

```json
{
  "service_id": "service-id",
  "query": "SELECT time, value FROM metrics ORDER BY time DESC LIMIT 25"
}
```

Permission: `READ`  
Approval: no

The connector rejects SQL that does not begin with a read-oriented statement or that contains mutation/DDL keywords.

## Create a service

First keep the connector in read mode while inspecting available services. For controlled execution, start the connector with `TIGER_CONNECTOR_ALLOW_WRITE=true` and an operator-held approval secret.

Tool: `tigerdata.service.create`

Example payload before approval:

```json
{
  "name": "agent-sandbox",
  "milli_cpu": 1000,
  "memory_gb": 4,
  "region_code": "us-east-1"
}
```

Permission: `WRITE`  
Approval: required by default

Generate an approval outside the model context:

```bash
TIGER_CONNECTOR_APPROVAL_SECRET='operator-secret-at-least-16-chars' \
node examples/create-approval.mjs \
  tigerdata.service.create \
  '{"name":"agent-sandbox","milli_cpu":1000,"memory_gb":4,"region_code":"us-east-1"}'
```

Add the returned digest as `approvalToken` without changing any other argument.

## Stop a service

Tool: `tigerdata.service.stop`

Permission: `HIGH_RISK`  
Approval: always required  
Feature gate: `TIGER_CONNECTOR_ALLOW_HIGH_RISK=true`

Stopping a service can interrupt applications. Inspect the target service first, generate approval for the exact stop payload, then execute.

## Write SQL

Tool: `tigerdata.database.query.write`

Permission: `HIGH_RISK`  
Approval: always required  
Feature gate: `TIGER_CONNECTOR_ALLOW_HIGH_RISK=true`

Example payload:

```json
{
  "service_id": "service-id",
  "query": "UPDATE device_state SET enabled = false WHERE device_id = $1",
  "parameters": ["device-123"]
}
```

Use the upstream schema returned by the installed Tiger CLI for the exact parameter field names. The connector never retries this tool automatically.
