# Observability

## Purpose
Make production behavior diagnosable without leaking sensitive information or overwhelming operators.

## Scope
Logs, metrics, traces, correlation, diagnostics, and health signals.

## MUST
- Critical operations MUST emit enough structured context to diagnose failures across boundaries.
- Metrics MUST distinguish success, failure, latency, saturation, and resource pressure where operationally relevant.
- Correlation identifiers MUST propagate across asynchronous and service boundaries when supported.
- Sensitive values MUST be redacted or excluded from telemetry.

## MUST NOT
- MUST NOT log secrets, tokens, private keys, or raw sensitive payloads.
- MUST NOT treat high-cardinality unbounded values as metric labels without review.
- MUST NOT swallow task or background-worker failures without observable signals.

## SHOULD
- Instrument at stable architectural boundaries rather than every function.
- Align telemetry with SLOs and incident investigation needs.

## Exceptions
Reduced telemetry in constrained environments requires documented diagnostic alternatives.

## Verification
Inspect emitted telemetry in integration/staging environments, validate redaction, cardinality, trace propagation, dashboards, and alert inputs.