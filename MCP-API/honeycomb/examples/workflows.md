# Honeycomb connector workflow examples

All examples call this connector's MCP tools. The `payload` is forwarded only to the fixed, allowlisted official Honeycomb MCP capability named by connector policy.

## Investigate latency

Tool: `honeycomb.environment.list`

```json
{ "payload": {} }
```

Permission: READ. Approval: no.

Tool: `honeycomb.dataset.list`

```json
{ "payload": { "environment_slug": "production" } }
```

Permission: READ. Approval: no.

Tool: `honeycomb.column.find`

```json
{ "payload": { "environment_slug": "production", "dataset_slug": "api", "query": "HTTP duration and route fields" } }
```

Permission: READ. Approval: no.

Tool: `honeycomb.query.run`

```json
{
  "payload": {
    "environment_slug": "production",
    "dataset_slug": "api",
    "query": {
      "calculations": [{ "op": "P95", "column": "duration_ms" }],
      "breakdowns": ["http.route"],
      "time_range": 900
    }
  }
}
```

Permission: READ. Approval: no. Expected output shape: `{ "ok": true, "risk": "READ", "result": <official MCP result> }`.

## Trace investigation

Tool: `honeycomb.trace.get`

```json
{ "payload": { "environment_slug": "production", "trace_id": "<trace-id>" } }
```

Permission: READ. Approval: no.

Tool: `honeycomb.bubbleup.run`

```json
{ "payload": { "environment_slug": "production", "dataset_slug": "api", "query_result_id": "<query-result-id>" } }
```

Permission: READ. Approval: no.

## Prepare and execute a board creation

Tool: `honeycomb.board.create`

```json
{
  "payload": { "environment_slug": "production", "name": "API latency investigation" },
  "approval": "<64-hex HMAC for this tool and exact payload>"
}
```

Permission: WRITE. Approval: required. Generate the approval outside the LLM using HMAC-SHA256 over `tool-name + newline + canonical payload`, with `HONEYCOMB_APPROVAL_SECRET` held by the connector operator.

## Alerting changes

`honeycomb.trigger.create` and `honeycomb.slo.update` are HIGH_RISK. Both require a payload-bound approval token. The connector never retries these operations automatically.
