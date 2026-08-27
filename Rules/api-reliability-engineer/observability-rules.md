# Observability Rules

## Purpose
Provide evidence sufficient to detect, localize, and explain API reliability failures.

## Scope
Covers logs, metrics, traces, correlation, telemetry quality, and operational diagnostics.

## MUST
- APIs MUST expose request rate, failures, latency distribution, and saturation signals for critical paths.
- Telemetry MUST support correlation across service boundaries using safe identifiers.
- Error telemetry MUST preserve diagnostic context without exposing secrets or prohibited personal data.
- Critical telemetry pipelines MUST have known failure behavior and monitoring for missing or delayed data.
- Reliability conclusions MUST distinguish measured evidence from inference.

## MUST NOT
- MUST NOT use averages alone to characterize tail latency.
- MUST NOT log credentials, authorization tokens, private keys, or unredacted sensitive payloads.
- MUST NOT treat absence of telemetry as proof of healthy behavior.

## SHOULD
- High-cardinality dimensions SHOULD be controlled deliberately to preserve cost and queryability.
- Distributed traces SHOULD sample errors and rare critical paths sufficiently for investigation.

## Exceptions
Exceptions require data-risk analysis, diagnostic alternatives, owner, retention considerations, and approval where required.

## Verification
Review dashboards, telemetry schemas, redaction tests, trace propagation, missing-data alerts, sample incidents, and query reproducibility.