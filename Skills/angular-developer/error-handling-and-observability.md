# Error Handling and Observability

## Purpose
Make Angular failures understandable to users and diagnosable by engineers without leaking sensitive data.

## When to use
Use when defining error strategy, production telemetry, incident diagnostics, or API failure UX.

## Inputs
Error contracts, telemetry platform, privacy constraints, user journeys, and operational requirements.

## Context to inspect
Inspect global handlers, HTTP errors, logging, source maps, correlation IDs, user messages, and telemetry sampling.

## Core knowledge
Expected domain errors and unexpected defects require different handling. Frontend telemetry should capture actionable context while minimizing personal or secret data.

## Procedure
1. Classify expected, transient, authorization, validation, and unexpected failures.
2. Define user-facing behavior per class.
3. Preserve structured technical context separately.
4. Propagate correlation identifiers where supported.
5. Capture unhandled errors centrally without double-reporting.
6. Configure source maps securely for diagnostics.
7. Add key journey and failure metrics.
8. Validate telemetry under real failure scenarios.

## Decision points
Retry only transient safe operations. Show detailed errors only when useful and non-sensitive; otherwise provide recovery guidance and correlation information.

## Common failure patterns
Catch-and-ignore, generic toast for every failure, logging tokens/PII, duplicate reporting, infinite retry, and telemetry without release/version context.

## Verification
Trigger representative failures and confirm user behavior, telemetry detail, correlation, privacy, and alert usefulness.

## Expected output
Consistent recovery UX and actionable production diagnostics.

## Stop conditions
Escalate when telemetry collection conflicts with privacy/security policy or required observability access is unavailable.