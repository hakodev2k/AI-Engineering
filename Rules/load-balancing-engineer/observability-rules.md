# Observability Rules

## Purpose
Make traffic behavior, failures, and load-balancer decisions diagnosable from evidence.

## Scope
Metrics, logs, traces, access logs, dashboards, and correlation identifiers.

## MUST
- Telemetry MUST expose request volume, success/error rates, latency distributions, backend health, connection state, and saturation signals relevant to the platform.
- Metrics MUST distinguish load-balancer-generated failures from backend-generated failures where possible.
- Logs MUST include enough routing context to investigate incidents without recording secrets.
- Time synchronization and consistent timestamps MUST support cross-system correlation.
- Critical dashboards MUST cover both client-side outcomes and backend-pool behavior.

## MUST NOT
- MUST NOT log credentials, authorization tokens, private keys, or sensitive payloads by default.
- MUST NOT rely solely on averages for latency or utilization.
- MUST NOT claim root cause from one telemetry signal when contradictory evidence exists.

## SHOULD
- Propagate trace context across proxy boundaries when supported.
- Use high-cardinality labels carefully to avoid telemetry instability or excessive cost.

## Exceptions
Reduced telemetry for privacy or cost requires documented diagnostic trade-offs and compensating signals.

## Verification
Inspect dashboards, metric labels, log samples, trace continuity, retention, redaction, and incident queries using real or synthetic failures.