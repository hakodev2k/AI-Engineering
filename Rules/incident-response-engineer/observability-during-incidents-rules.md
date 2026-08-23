# Observability During Incidents Rules

## Purpose
Use telemetry safely and improve visibility without distorting incident diagnosis.

## Scope
Logs, metrics, traces, dashboards, alerts, profiling, and temporary diagnostic instrumentation.

## MUST
- Validate dashboard definitions, aggregation windows, dimensions, sampling, and data freshness before relying on them for consequential decisions.
- Correlate service-level indicators with customer-visible outcomes.
- Record material telemetry gaps and their effect on confidence.
- Ensure temporary diagnostic changes respect privacy, security, and performance constraints.

## MUST NOT
- Log secrets, authentication tokens, or unnecessary sensitive payloads for debugging.
- Assume a green dashboard proves end-to-end recovery when the dashboard does not cover the affected path.

## SHOULD
- Prefer high-cardinality-safe correlation identifiers and distributed traces for cross-service diagnosis when available.

## Exceptions
Temporary increased telemetry may be justified for bounded diagnosis with explicit expiry and risk review.

## Verification
Inspect dashboard queries, telemetry configuration, sampling, timestamps, end-to-end probes, and cleanup of temporary instrumentation.