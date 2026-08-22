# Telemetry and Alerting Rules

## Purpose
Make system behavior diagnosable and alerts actionable without exposing sensitive data, creating unbounded cost, or replacing service ownership with dashboard noise.

## Scope
Applies to logs, metrics, traces, events, dashboards, service-level indicators and objectives, synthetic checks, alert policies, and incident integrations.

## MUST
- Define the user or service outcome, owner, signal, threshold or baseline, and response expectation before creating a production alert.
- Propagate a correlation or trace identifier across supported service boundaries and make it usable for investigation without logging secrets or full sensitive payloads.
- Limit telemetry fields, cardinality, retention, and access according to the target privacy, security, and cost policy.
- Make paging alerts actionable: they MUST identify the affected service or journey, severity, current signal, owner or escalation path, and a first investigation step.
- Validate new or changed telemetry with synthetic, staging, or controlled traffic before relying on it for a production decision.
- Version or record material SLO, alert, dashboard, and sampling changes with their rationale and rollback path.

## MUST NOT
- MUST NOT emit credentials, access tokens, payment data, regulated personal data, raw prompts, or unreviewed customer content merely for debugging.
- MUST NOT page on an unowned metric, a threshold without an expected response, a known noisy signal, or a condition that cannot be investigated.
- MUST NOT use high-cardinality identifiers such as unrestricted user IDs, request bodies, URLs with sensitive values, or arbitrary labels without a reviewed aggregation and retention design.
- MUST NOT declare reliability or performance healthy solely because a dashboard loads or a single host is reachable.

## SHOULD
- SHOULD derive alerts from service-level indicators and error-budget or impact policy rather than infrastructure noise alone.
- SHOULD document expected normal ranges, sampling behavior, gaps, and data freshness beside each decision-critical dashboard.
- SHOULD test alert delivery, acknowledgement, escalation, silencing, and recovery as part of incident readiness.

## Exceptions
An exception requires the temporary telemetry or alert change, data classification, blast radius, expiry, compensating controls, cost owner, security/privacy approval when applicable, and a removal or review date. A debugging deadline is not sufficient justification for collecting unrestricted data.

## Verification
Demonstrate the signal under known-good and known-bad conditions, verify field redaction and cardinality limits, trace a representative request end-to-end, exercise the alert routing path, and record the owner, runbook, threshold rationale, and rollback result.
