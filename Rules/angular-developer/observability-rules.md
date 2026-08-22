# Observability Rules

## Purpose
Provide enough safe client-side evidence to diagnose production behavior without turning telemetry into a privacy or security liability.

## Scope
Frontend logs, errors, traces, performance signals, analytics diagnostics, and correlation.

## MUST
- Capture actionable client failures with release/version and safe execution context.
- Correlate frontend operations with backend requests when supported.
- Define telemetry retention and sensitive-data handling consistent with project policy.
- Verify observability for critical flows before relying on it for production conclusions.

## MUST NOT
- Log credentials, access tokens, full sensitive payloads, or unnecessary personal data.
- Use telemetry volume as a substitute for meaningful signals.
- Claim root cause from incomplete client telemetry when backend or infrastructure evidence is required.

## SHOULD
- Track critical journey failures and performance regressions with stable dimensions and alertable thresholds where appropriate.

## Exceptions
Additional diagnostic capture during an incident requires bounded duration, privacy/security review, and removal or rollback plan.

## Verification
Inspect emitted telemetry in a production-like environment, redaction behavior, correlation, dashboards, and representative incident queries.