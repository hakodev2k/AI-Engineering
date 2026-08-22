# Error Handling and Resilience

## Purpose
Design Vue failure behavior that is understandable to users, diagnosable by engineers, and resilient to partial dependency failures.

## When to use
Use for API-heavy features, global error handling, async workflows, and production incident remediation.

## Inputs
Failure modes, API error contracts, UX requirements, telemetry, and retry semantics.

## Context to inspect
Inspect global handlers, HTTP client, router, async components, stores, logging, and current user notifications.

## Core knowledge
Expected domain errors differ from programming failures. Retries require bounded policy and safe operations. User messages should be actionable without leaking sensitive internals.

## Procedure
1. Enumerate expected failure classes.
2. Decide which layer owns each error.
3. Normalize transport errors while preserving useful domain semantics.
4. Model recoverable UI states explicitly.
5. Add bounded retries only for transient failures.
6. Provide retry/recovery actions where useful.
7. Capture diagnostic context without sensitive data.
8. Handle async component and route-load failures.
9. Test offline, timeout, authorization, validation, and server-error paths.

## Decision points
Handle locally when the feature can recover meaningfully; escalate globally for unexpected failures or application-wide conditions. Retry reads more freely than non-idempotent writes.

## Common failure patterns
Catch-and-ignore, generic toast for every error, infinite retry loops, leaking stack details, duplicate error notifications, and leaving UI stuck in loading state.

## Verification
Inject representative failures, verify recovery and telemetry, and ensure loading/submission state always settles.

## Expected output
Predictable error states, safe recovery, and actionable diagnostics.

## Stop conditions
Stop when backend error semantics or retry safety cannot be established.