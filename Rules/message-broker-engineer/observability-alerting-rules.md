# Observability and Alerting

## Purpose
Make broker health, message flow, and failure conditions diagnosable.

## Scope
Metrics, logs, traces, dashboards, alerts, lag, queue depth, and broker health.

## MUST
- Critical flows MUST expose throughput, error, latency or age, backlog/lag, and resource saturation signals.
- Alerts MUST be actionable, owned, and tied to service impact or imminent risk.
- Correlation metadata MUST enable tracing a message across components without leaking sensitive payloads.

## MUST NOT
- MUST NOT rely on broker-up status as the sole health signal.
- MUST NOT log secrets or full sensitive payloads by default.

## SHOULD
- Prefer SLO-oriented alerts over noisy threshold collections.

## Exceptions
Document visibility gaps, risk, compensating evidence, and remediation owner.

## Verification
Inspect dashboards, alert tests, trace continuity, log redaction, and incident evidence.