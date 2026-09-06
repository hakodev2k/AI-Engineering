# Memory Observability Rules

## Purpose
Provide evidence to understand memory writes, retrievals, quality, latency, and policy failures in production.

## Scope
Metrics, logs, traces, audit events, dashboards, and alerts.

## MUST
- Telemetry MUST distinguish write, retrieve, update, delete, conflict, and invalidation operations.
- Production metrics MUST cover latency, error rate, retrieval yield, stale retrieval, write rejection, and propagation lag where relevant.
- High-risk memory operations MUST be auditable without exposing prohibited sensitive content.
- Alerts MUST correspond to actionable conditions and accountable owners.

## MUST NOT
- MUST NOT log raw sensitive memory content by default.
- MUST NOT treat successful API responses as sufficient evidence of semantic correctness.
- MUST NOT remove diagnostic evidence required for active incident investigation.

## SHOULD
- Correlate memory operations with request, agent, model, and deployment versions where policy permits.
- Annotate dashboards with migrations, index rebuilds, and retrieval-policy changes.

## Exceptions
Reduced telemetry requires privacy or cost rationale and alternative evidence.

## Verification
Inspect dashboards, log redaction, traces, alert definitions, audit events, and incident usability reviews.