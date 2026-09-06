# Observability and Alerting Rules

## Purpose
Make CDC correctness and operational health diagnosable from evidence.

## Scope
Metrics, logs, traces, heartbeats, alerts, dashboards, and correlation metadata.

## MUST
- Telemetry MUST expose source position, acknowledged position, lag, throughput, errors, retries, and resource saturation where applicable.
- Alerts MUST distinguish correctness risk from transient availability noise.
- Logs MUST identify connector, source, partition/shard, and bounded position without exposing sensitive payloads.
- Critical pipelines MUST alert on stalled progress even when processes remain healthy.
- Operational conclusions MUST use telemetry or equivalent evidence.

## MUST NOT
- MUST NOT use process uptime as the sole health signal.
- MUST NOT log secrets or unrestricted row contents.
- MUST NOT page on non-actionable conditions without ownership.

## SHOULD
- Correlate schema changes and deployments with CDC incidents.
- Provide dashboards for retention headroom and backlog drain rate.

## Exceptions
Telemetry reductions require documented privacy/cost rationale and alternative evidence.

## Verification
Review dashboards, alerts, redaction, synthetic probes, incident timelines, and telemetry cardinality.