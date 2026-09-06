# Audit and Observability Rules

## Purpose
Make registry changes and operational failures traceable with evidence suitable for incident response and governance.

## Scope
Audit logs, metrics, traces, registration events, policy changes, authentication, and administrative operations.

## MUST
- Production schema registration, deletion, compatibility-policy changes, and privileged access MUST be auditable.
- Audit events MUST identify actor, subject, action, result, timestamp, and environment where practical.
- Operational metrics MUST cover request errors, latency, availability, registration failures, and backend saturation.
- Alerts MUST map to actionable conditions and accountable ownership.
- Investigation conclusions MUST use available audit, metric, log, or trace evidence.

## MUST NOT
- MUST NOT log secrets or sensitive payload data merely to improve diagnostics.
- MUST NOT silently discard failed administrative operations from audit records.
- MUST NOT claim root cause from correlation alone when stronger evidence is available.

## SHOULD
- Annotate operational dashboards with deployments and major policy changes.
- Retain audit history according to security and compliance requirements.

## Exceptions
Reduced telemetry requires documented privacy, cost, or platform constraints and alternate evidence.

## Verification
Inspect audit events, dashboards, alerts, log redaction, and incident investigation records.