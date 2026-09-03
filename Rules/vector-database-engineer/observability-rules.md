# Observability

## Purpose
Provide sufficient evidence to diagnose retrieval quality, performance, freshness, capacity, and failures.

## Scope
Applies to logs, metrics, traces, dashboards, alerts, and retrieval-specific telemetry.

## MUST
- Production telemetry MUST cover request rate, errors, percentile latency, saturation, index state, ingestion/freshness lag, and resource pressure.
- Retrieval traces MUST make major pipeline stages distinguishable when end-to-end latency spans multiple components.
- Alerts MUST correspond to actionable user or SLO impact and identify ownership.
- Telemetry MUST avoid secrets and unnecessary sensitive query/document content.
- Operational conclusions MUST use available evidence rather than agent confidence or isolated anecdotes.

## MUST NOT
- MUST NOT log raw sensitive vectors, authentication tokens, or private source text by default.
- MUST NOT declare an incident resolved solely because an alert stopped firing.
- MUST NOT create high-cardinality telemetry without assessing cost and stability.

## SHOULD
- Dashboards SHOULD correlate relevance proxies, latency, filter behavior, index health, and freshness.
- Sampling SHOULD preserve enough failed and slow requests for investigation.
- Telemetry schemas SHOULD be versioned when consumers depend on them.

## Exceptions
Exceptions require documented observability gap, compensating evidence, duration, risk, and approval when production diagnosis is materially impaired.

## Verification
Inspect dashboards, alert tests, trace samples, log schemas, redaction tests, metric cardinality, and incident investigations.