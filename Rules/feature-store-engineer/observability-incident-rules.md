# Observability and Incident Rules

## Purpose
Provide evidence to detect, diagnose, and mitigate feature-platform failures.

## Scope
Metrics, logs, traces, lineage context, alerts, incident response, and post-incident actions.

## MUST
- Telemetry MUST identify affected feature, version, pipeline, store, and environment where relevant.
- Metrics MUST cover freshness, failures, latency, throughput, saturation, and data-quality health.
- Alerts MUST map to actionable conditions and accountable ownership.
- Incident diagnosis MUST use available telemetry and lineage rather than agent confidence.
- Significant incidents MUST document impact, timeline, mitigation, root cause or bounded causal evidence, and corrective actions.

## MUST NOT
- MUST NOT log raw sensitive feature values unless specifically authorized and protected.
- MUST NOT delete evidence needed for active investigation.
- MUST NOT claim root cause solely from temporal correlation.

## SHOULD
- Annotate dashboards with deployments, backfills, and schema changes.
- Add regression checks for confirmed failure modes.

## Exceptions
Telemetry reduction requires privacy or cost rationale and alternative evidence.

## Verification
Inspect dashboards, alerts, log redaction, incident records, and corrective-test coverage.