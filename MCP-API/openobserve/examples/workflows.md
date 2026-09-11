# OpenObserve MCP connector workflows

All examples use connector-scoped tools. Provider credentials stay in the connector process and are never tool arguments.

## Investigate recent application errors

1. `openobserve.stream.list`

```json
{ "type": "logs", "fetchSchema": false }
```

Permission: `READ`. Approval: no.

2. `openobserve.stream.schema`

```json
{ "stream": "application_logs", "type": "logs" }
```

Permission: `READ`. Approval: no.

3. `openobserve.search.sql`

```json
{
  "sql": "SELECT level, service, message, _timestamp FROM application_logs WHERE level = 'error' ORDER BY _timestamp DESC",
  "start_time": 1789098000000000,
  "end_time": 1789101600000000,
  "size": 50,
  "output_format": "md_table",
  "partition_mode": true
}
```

Expected output shape:

```json
{
  "source": "mcp",
  "data": { "content": [] }
}
```

If the official MCP call is unavailable and REST fallback is enabled, `source` is `rest` and `data` contains the OpenObserve Search API response.

Permission: `READ`. Approval: no.

## Inspect trace activity

```json
{
  "stream": "default",
  "start_time": 1789098000000000,
  "end_time": 1789101600000000,
  "size": 25
}
```

Tool: `openobserve.trace.latest`

Permission: `READ`. Approval: no.

## Query metrics

```json
{
  "query": "rate(http_requests_total[5m])",
  "start": 1789098000,
  "end": 1789101600,
  "step": 60
}
```

Tool: `openobserve.metrics.range_query`

Permission: `READ`. Approval: no.

## Investigate search performance

```json
{}
```

Tool: `openobserve.search.profile`

Permission: `READ`. Approval: no.

## Inspect cluster compaction backlog

```json
{}
```

Tool: `openobserve.cluster.info`

Permission: `READ`. Approval: no.
