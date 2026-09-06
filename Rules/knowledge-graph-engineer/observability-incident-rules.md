# Observability and Incident Rules

## Purpose
Provide evidence to detect, diagnose, and mitigate knowledge-graph failures.

## Scope
Metrics, logs, traces, query telemetry, ingestion health, data-quality alerts, and incident response.

## MUST
- Telemetry MUST identify affected graph domain, schema or ontology version, pipeline, and environment where relevant.
- Metrics MUST cover ingestion failures, query latency, error rate, resource saturation, validation failures, and freshness where applicable.
- Alerts MUST map to actionable conditions and accountable ownership.
- Incident conclusions MUST use logs, metrics, traces, lineage, or equivalent evidence.
- Significant incidents MUST document impact, timeline, mitigation, causal evidence, and corrective actions.

## MUST NOT
- MUST NOT log sensitive graph values without explicit authorization.
- MUST NOT delete evidence needed for an active investigation.
- MUST NOT claim root cause solely from timing correlation.

## SHOULD
- Annotate dashboards with deployments, migrations, backfills, and ontology changes.
- Add regression checks for confirmed failure modes.

## Exceptions
Telemetry reduction requires privacy or cost rationale and alternative evidence.

## Verification
Inspect dashboards, alerts, trace context, incident records, and corrective-test coverage.