# HTTP and API Integration Rules

## Purpose
Make frontend/backend interactions explicit, resilient, compatible, and diagnosable.

## Scope
HttpClient, interceptors, API models, cancellation, retries, errors, pagination, and mutations.

## MUST
- Define typed request/response boundaries and validate assumptions about optionality, nullability, and error shapes.
- Preserve HTTP semantics and distinguish authentication, authorization, validation, conflict, throttling, and server failures.
- Make mutation retry behavior depend on idempotency guarantees.
- Cancel obsolete requests where stale responses can corrupt UI state.

## MUST NOT
- Globally transform every HTTP error into a generic success/fallback.
- Put unrelated business logic into interceptors.
- Assume generated or TypeScript types validate untrusted runtime payloads.

## SHOULD
- Centralize stable transport concerns such as correlation headers and standardized error mapping without hiding endpoint semantics.

## Exceptions
A tolerant parser may accept compatible server variations when fallback behavior is explicit and monitored.

## Verification
Use integration/contract tests, network inspection, failure simulation, cancellation tests, and backend contract review.