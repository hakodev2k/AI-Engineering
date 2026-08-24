# Idempotency and Replay

## Purpose
Make retried and duplicated requests safe where operations require it.

## Scope
Mutation endpoints, idempotency keys, deduplication, replay windows, and result reuse.

## MUST
- Operations exposed to automatic retry MUST define duplicate-delivery semantics.
- Idempotency keys MUST be scoped to the correct caller and operation and stored for a documented window.
- Duplicate requests MUST not repeat irreversible side effects when idempotency is promised.

## MUST NOT
- MUST NOT claim idempotency when downstream side effects can execute more than once without control.
- MUST NOT leak one caller's cached result to another caller.

## SHOULD
- Idempotency behavior SHOULD be explicit in API documentation.

## Exceptions
Non-idempotent retry behavior requires explicit consumer warning and risk acceptance.

## Verification
Run duplicate-request, concurrent-replay, expiry, tenant-isolation, and downstream-failure tests.