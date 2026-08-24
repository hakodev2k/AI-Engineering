# Observability Rules

## Purpose
Make database health, saturation, correctness risks, and failure modes diagnosable.

## Scope
Metrics, logs, traces, waits, query telemetry, dashboards, and alerting.

## MUST
- Collect signals for availability, latency, errors, saturation, replication, storage, and connection pressure.
- Alert on actionable conditions with documented response ownership.
- Preserve enough telemetry to reconstruct significant incidents.
- Correlate database symptoms with application and infrastructure context where possible.

## MUST NOT
- Do not alert only on static host thresholds when service-level symptoms are available.
- Do not log credentials, secrets, or sensitive query data without explicit need and protection.

## SHOULD
- Track baselines and anomaly trends to detect degradation before hard failure.

## Exceptions
Telemetry gaps require documented risk, owner, expiry, and compensating checks.

## Verification
Review dashboards, alert rules, retention settings, sample incidents, and telemetry coverage.