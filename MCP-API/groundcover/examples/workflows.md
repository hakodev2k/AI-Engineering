# Workflows

All tools are `READ`; no human approval is required. Returned provider data is marked untrusted.

## Investigate Kubernetes capacity
1. `groundcover.clusters.list` — `{}` → `{clusters:[...], totalCount:n}`.
2. `groundcover.workloads.list` — `{"limit":50,"sortBy":"cpuUsage"}` → paginated workload metrics.
3. `groundcover.nodes.list` — `{"start":"2026-09-23T00:00:00.000Z","end":"2026-09-23T01:00:00.000Z","limit":100}` → node resource data.

## Inspect alerting
1. `groundcover.monitors.summary` — `{"limit":50,"sortBy":"lastFiringStart"}` → monitor state/instances.
2. `groundcover.workflows.list` — `{}` → workflow definitions and execution status.

## Query metrics
- `groundcover.metrics.query` — `{"query":"up"}` → Prometheus instant-query response.
- `groundcover.metrics.query_range` — `{"query":"rate(http_requests_total[5m])","start":"2026-09-23T00:00:00Z","end":"2026-09-23T01:00:00Z","step":"60s"}` → Prometheus range-query response.
