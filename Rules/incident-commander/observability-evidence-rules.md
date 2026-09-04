# Observability Evidence Rules

## Purpose
Ensure incident conclusions are grounded in operational evidence.

## Scope
Applies to logs, metrics, traces, alerts, health checks, synthetic tests, audit records, and business signals used during response.

## MUST
- Use available telemetry to bound impact, identify change points, and validate mitigation effects.
- Correlate evidence by time, system, version, region, tenant, or request path when relevant.
- Preserve important evidence before retention, restart, or remediation actions can destroy it.
- Record gaps where observability is insufficient to support a conclusion.
- Use multiple independent signals for high-consequence conclusions when practical.

## MUST NOT
- Claim recovery from a single green dashboard while material impact signals remain unexplained.
- Treat missing telemetry as proof that no impact exists.
- Expose secrets or sensitive customer data in incident artifacts.

## SHOULD
- Prefer direct impact indicators over proxy health metrics.
- Capture screenshots or query references only when reproducibility is preserved.

## Exceptions
When telemetry is unavailable, document alternative evidence and uncertainty.

## Verification
Review dashboards, queries, traces, alert history, evidence links, and the incident timeline for reproducible support of key conclusions.