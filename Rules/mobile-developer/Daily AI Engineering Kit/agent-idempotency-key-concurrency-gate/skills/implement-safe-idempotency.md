# Implement Safe Idempotency

## Purpose
Implement the smallest safe idempotency fix after investigation confirms a gap.

## Procedure
1. Preserve the existing public contract unless change is explicitly required.
2. Define key scope: tenant/principal + operation + idempotency key.
3. Compute a stable fingerprint from semantically relevant request data; exclude volatile transport metadata.
4. Atomically claim the scoped key using an existing transaction/unique constraint/atomic store primitive.
5. Only the claim owner may execute side effects. Concurrent callers wait, poll with a bounded policy, or receive the documented in-progress response.
6. Persist terminal status plus replayable response before releasing ownership where the storage model allows it.
7. Reject a previously claimed key whose fingerprint differs; never silently replay a response for a different request.
8. Add tests for sequential replay, concurrent same-key requests, different payload with same key, handler failure, and recovery after an interrupted in-progress state.
9. Run project build/tests and inspect the final diff for unrelated changes.
10. Hand off to the Verification Agent; the implementer cannot be sole verifier.

## Approval boundaries
Stop before database schema changes, production configuration changes, breaking API changes, destructive cleanup, or weakening authentication/authorization.

## Failure handling
Retry deterministic build/test execution at most twice only when failure evidence indicates infrastructure/transient failure. Code/test failures require diagnosis and a new change, not blind retry.
