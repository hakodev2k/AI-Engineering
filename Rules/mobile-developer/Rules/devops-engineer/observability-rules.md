# Observability Rules

## Purpose
Ensure production systems expose actionable evidence for reliability, performance, and incident investigation.

## Scope
Applies to logs, metrics, traces, dashboards, alerts, and operational telemetry.

## MUST
- Critical services MUST expose health, error, latency, and saturation signals appropriate to their role.
- Alerts MUST correspond to actionable conditions with defined owners and response expectations.
- Telemetry MUST include enough context to correlate failures without exposing secrets or sensitive data.
- Observability changes MUST be deployed with system changes that introduce new critical failure modes.
- Production conclusions MUST be based on available telemetry rather than assumptions alone.

## MUST NOT
- MUST NOT log secrets, tokens, passwords, or unnecessary sensitive payloads.
- MUST NOT create high-noise alerts without remediation or ownership.
- MUST NOT disable monitoring to hide deployment regressions.

## SHOULD
- Prefer service-level indicators tied to user impact.
- Prefer structured logs and trace correlation across distributed boundaries.

## Exceptions
Reduced telemetry in sensitive environments requires documented risk and alternative verification mechanisms.

## Verification
Review dashboards, alert history, log schemas, trace coverage, retention policies, incident evidence, and synthetic checks.