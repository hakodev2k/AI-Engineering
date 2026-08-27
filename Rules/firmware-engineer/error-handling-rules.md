# Error Handling

## Purpose
Ensure failures are propagated, classified, and handled intentionally.

## Scope
Drivers, services, protocols, startup, storage, and application logic.

## MUST
- APIs that can fail MUST expose failure in a form callers can act upon.
- Error handling MUST distinguish recoverable, retryable, degraded, and fatal outcomes where behavior differs.
- Retry behavior MUST be bounded and account for idempotency and hardware side effects.
- Critical errors MUST retain sufficient context for diagnosis without exposing secrets.

## MUST NOT
- Unexpected errors MUST NOT be silently ignored.
- Return codes or status flags MUST NOT be discarded when failure can affect correctness.
- Infinite retry loops MUST NOT mask persistent failures.

## SHOULD
- Error taxonomies SHOULD remain stable across modules.

## Exceptions
Intentionally ignored errors require documented proof that the outcome is irrelevant.

## Verification
Review all failure paths, inject driver/protocol/storage faults, and inspect logs, state transitions, and caller behavior.