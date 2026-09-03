# Observability Rules

## Purpose
Make GraphQL production behavior diagnosable without exposing sensitive query data.

## Scope
Applies to logs, metrics, traces, operation naming, field timing, dependency calls, and error telemetry.

## MUST
- Production telemetry MUST identify GraphQL operations with stable, low-cardinality identifiers where possible.
- Traces MUST capture major resolver and downstream dependency latency for critical paths.
- Error telemetry MUST distinguish validation, authorization, domain, dependency, and unexpected failures.
- Sensitive variables, credentials, and protected field values MUST be redacted or excluded.
- Monitoring MUST cover latency, error rate, request volume, complexity rejections, and downstream amplification.

## MUST NOT
- MUST NOT use raw query text or arbitrary variables as uncontrolled high-cardinality metric labels.
- MUST NOT log secrets, tokens, or sensitive personal data for diagnostic convenience.
- MUST NOT declare an incident resolved without supporting operational evidence.

## SHOULD
- SHOULD correlate GraphQL spans with downstream service and database traces.
- SHOULD maintain dashboards for the highest-impact operations.

## Exceptions
Additional sensitive telemetry requires explicit security/privacy approval, bounded retention, and access controls.

## Verification
Inspect telemetry schemas, dashboards, trace samples, redaction tests, cardinality metrics, and incident evidence.