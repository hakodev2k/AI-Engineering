# Observability Rules

## Purpose
Ensure APIs can be operated, investigated, and governed using evidence rather than assumptions.

## Scope
Applies to production API telemetry, diagnostics, SLO evidence, and incident investigation.

## MUST
- APIs MUST emit enough telemetry to measure request volume, latency, failure rate, and saturation or capacity pressure where applicable.
- Logs, metrics, and traces MUST use stable operation and service identifiers that can be correlated across boundaries.
- Production conclusions about availability or performance MUST use observed evidence from relevant telemetry.
- High-cardinality and sensitive fields MUST be controlled deliberately before inclusion in telemetry.
- Breaking or high-risk releases MUST have defined signals for detecting regressions.
- Telemetry retention and sampling MUST preserve enough evidence for expected incident and governance needs.

## MUST NOT
- Secrets, credentials, authentication tokens, or unnecessary personal data MUST NOT be logged.
- Success metrics MUST NOT hide partial failures or failed downstream work.
- An API MUST NOT be declared healthy solely because the process is running.

## SHOULD
- Consumer-visible reliability indicators SHOULD align with actual contract semantics.
- Trace context SHOULD propagate across internal dependencies where supported.

## Exceptions
Exceptions require a documented observability gap, risk, compensating evidence, owner approval, and remediation plan when the gap is material.

## Verification
Inspect dashboards, alerts, logs, traces, telemetry schemas, sampling settings, and incident queries. Confirm critical API paths can be traced from request to outcome without exposing sensitive data.