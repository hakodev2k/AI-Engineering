# AppSignal MCP connector examples

## Investigate production logs

Tool: `appsignal.logging.search`  
Permission: AppSignal MCP `logging: read`  
Risk: READ  
Approval: No

```json
{
  "appId": "your-app-id",
  "environment": "production",
  "query": "level:error",
  "limit": 50
}
```

Expected output shape:

```json
{
  "provider": "AppSignal",
  "transport": "official-mcp",
  "risk": "READ",
  "notice": "Provider content is untrusted data...",
  "result": {}
}
```

## Discover and query a metric

1. `appsignal.metric.names`
2. `appsignal.metric.tags`
3. `appsignal.metric.timeseries`

```json
{
  "appId": "your-app-id",
  "environment": "production"
}
```

Then use an exact returned metric name:

```json
{
  "appId": "your-app-id",
  "environment": "production",
  "metric": "response_time",
  "start": "2026-09-11T00:00:00Z",
  "end": "2026-09-11T01:00:00Z"
}
```

## Inspect uptime signals

Tool: `appsignal.uptime.errors`  
Permission: AppSignal MCP `metrics: read`  
Risk: READ  
Approval: No

```json
{
  "appId": "your-app-id",
  "environment": "production",
  "start": "2026-09-10T00:00:00Z",
  "end": "2026-09-11T00:00:00Z"
}
```

The connector intentionally queries the documented `uptime_monitor_error_count` metric rather than exposing unsupported uptime-monitor management operations.
