# Observability and Tracing Rules

## Purpose
Make routing decisions and failures explainable from production evidence.

## Scope
Decision logs, metrics, traces, model/provider identity, fallbacks, latency, errors, cost, and quality signals.

## MUST
- Production telemetry MUST identify route version, selected target, decision reason, and fallback status where permitted.
- Routing, queueing, provider, and post-processing latency SHOULD be separable in traces.
- Metrics MUST expose success rate, error class, fallback rate, latency, and saturation by meaningful route dimensions.
- Telemetry MUST preserve correlation across routing and downstream provider calls.
- Operational conclusions MUST use available logs, metrics, traces, and provider evidence rather than confidence alone.

## MUST NOT
- MUST NOT log secrets, authentication tokens, or prohibited raw sensitive content.
- MUST NOT use unbounded high-cardinality request data as metric labels.
- MUST NOT remove evidence needed for active incident investigation without approval.

## SHOULD
- Annotate dashboards with route configuration and provider changes.
- Sample traces deliberately while retaining high-value failure paths.

## Exceptions
Telemetry reductions require privacy/cost rationale and alternative diagnostic evidence.

## Verification
Inspect trace propagation, dashboards, metric cardinality, log redaction, and incident reconstruction tests.