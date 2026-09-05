# Payment Observability Rules

## Purpose
Make financial failures detectable and diagnosable without exposing sensitive data.

## Scope
Logs, metrics, traces, dashboards, alerts, provider calls, queues, payment states, and reconciliation signals.

## MUST
- Telemetry MUST correlate a payment operation across internal services and external provider interactions using non-sensitive identifiers.
- Metrics MUST cover request rate, success/failure, latency, retry rate, provider errors, queue depth, reconciliation gaps, and duplicate-prevention outcomes where relevant.
- Alerts MUST map to actionable payment or financial failure modes and an accountable owner.
- Production conclusions MUST use available logs, metrics, traces, provider evidence, or reconciliation data rather than agent confidence.
- Telemetry MUST preserve enough version and provider context to compare deployments.

## MUST NOT
- MUST NOT log raw card data, bank secrets, authentication values, or credentials.
- MUST NOT rely on aggregate HTTP status alone as payment-health evidence.
- MUST NOT suppress financially material errors to reduce alert volume.

## SHOULD
- Track business-level outcome metrics in addition to infrastructure health.

## Exceptions
Require documented privacy or operational rationale and alternative diagnostic evidence.

## Verification
Inspect dashboards, alerts, trace samples, redaction controls, and incident investigations.