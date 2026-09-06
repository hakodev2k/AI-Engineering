# Observability and Incident Rules

## Purpose
Provide enough evidence to detect, diagnose, and recover from retrieval failures.

## Scope
Metrics, logs, traces, alerts, query diagnostics, index health, and incident response.

## MUST
- Telemetry MUST identify retrieval stage, index version, model version, and relevant environment context.
- Metrics MUST cover errors, latency, empty-result rate, candidate counts, freshness, and index health.
- Alerts MUST map to actionable failure conditions and accountable ownership.
- Incident investigation MUST use traces, logs, metrics, and retrieval evidence rather than confidence alone.
- Significant incidents MUST produce corrective actions and regression coverage where practical.

## MUST NOT
- MUST NOT log secrets or unnecessary sensitive retrieved text.
- MUST NOT delete evidence needed for an active investigation.
- MUST NOT claim root cause solely from timing correlation.

## SHOULD
- Annotate dashboards with index migrations, embedding changes, and ranking changes.
- Retain sampled retrieval traces with privacy controls.

## Exceptions
Reduced telemetry requires documented privacy or cost rationale and alternative evidence.

## Verification
Inspect dashboards, alerts, traces, redaction checks, incident records, and follow-up tests.