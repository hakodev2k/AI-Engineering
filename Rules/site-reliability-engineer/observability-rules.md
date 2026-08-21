# Observability Rules

## Purpose
Ensure production behavior can be understood from evidence during normal operation and failure.

## Scope
Applies to logs, metrics, traces, events, correlation identifiers, and diagnostic instrumentation.

## MUST
- Critical services MUST emit telemetry sufficient to reconstruct major request and dependency paths.
- Telemetry MUST preserve timestamps, service identity, environment, and correlation context where applicable.
- Sensitive data MUST be redacted or excluded before telemetry is emitted.
- Instrumentation changes that alter operational visibility MUST be reviewed like production behavior changes.
- High-cardinality telemetry MUST be intentionally bounded.

## MUST NOT
- MUST NOT log credentials, tokens, private keys, or unnecessary personal data.
- MUST NOT treat dashboards as proof when the underlying telemetry is incomplete or stale.
- MUST NOT remove diagnostic fields during incidents without preserving equivalent evidence.

## SHOULD
- Prefer structured telemetry and stable semantic fields.
- Trace sampling SHOULD retain enough representative and error traffic for investigation.

## Exceptions
Reduced instrumentation is allowed only with documented cost, risk, compensating evidence, and review.

## Verification
Inspect telemetry schemas, sample traces, log redaction, metric cardinality, retention settings, and incident investigations.