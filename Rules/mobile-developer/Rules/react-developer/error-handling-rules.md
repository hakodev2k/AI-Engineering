# Error Handling Rules

## Purpose
Make frontend failures visible, recoverable where possible, and diagnostically useful.

## Scope
Applies to render errors, API failures, async operations, route failures, and user-facing recovery.

## MUST
- Expected failures MUST have explicit UI behavior rather than falling through to generic crashes.
- Unexpected render failures on critical surfaces MUST be isolated with appropriate error boundaries or equivalent recovery mechanisms.
- User-visible errors MUST avoid exposing secrets, stack traces, or sensitive backend details.
- Retry actions MUST be safe for the failed operation.
- Diagnostic events MUST include enough context to correlate failures without logging sensitive data.

## MUST NOT
- MUST NOT silently swallow rejected promises or exceptions that affect user-visible behavior.
- MUST NOT show success state when an operation failed or remains unverified.
- MUST NOT create infinite automatic retry loops.

## SHOULD
- Prefer actionable recovery messages over generic failure text.
- Prefer preserving user input and navigation state after recoverable errors.

## Exceptions
Document intentionally ignored failures, user impact, evidence that suppression is safe, and reviewer approval.

## Verification
Use failure-path tests, rejected-request simulation, error-boundary tests, telemetry inspection, and review of recovery behavior.