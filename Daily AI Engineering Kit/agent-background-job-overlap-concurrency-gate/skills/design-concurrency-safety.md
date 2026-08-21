# Skill: Design Concurrency Safety

## Purpose
Select and verify the smallest concurrency control that prevents harmful overlap without silently changing business throughput.

## Inputs
Confirmed overlap finding, job identity, side effects, scheduler behavior, data ownership, acceptable duplicate semantics, and deployment constraints.

## Preconditions
The unsafe overlap mechanism is evidenced or explicitly labeled as a hypothesis.

## Procedure
1. Decide whether overlap is business-valid. If yes, require side-effect idempotency and conflict-safe state transitions.
2. If only one execution may run globally, prefer a distributed singleton/lease keyed by stable job identity; process-local locks are insufficient in multi-instance deployments.
3. If only identical logical inputs must serialize, key the lock/idempotency record by normalized logical job input rather than worker instance.
4. Define lock acquisition timeout separately from lease lifetime.
5. Ensure lease lifetime exceeds the protected critical section or implement safe renewal with ownership tokens.
6. Ensure release checks ownership; never let a stale worker release a successor's lease.
7. Define crash recovery and stale lease expiry.
8. Add an idempotency boundary around irreversible external side effects where the downstream system does not guarantee deduplication.
9. Ensure database state transitions use optimistic concurrency, unique constraints, or atomic compare-and-set where appropriate.
10. Keep retries bounded and ensure a retry cannot overlap an attempt whose outcome is unknown without an idempotency key.
11. Add tests that intentionally start concurrent executions and assert one of: serialization, safe deduplication, or conflict rejection.
12. Re-run repository scanner and inspect the diff.
13. Require human approval before production scheduler changes, production job disabling, schema changes, or infrastructure changes.

## Verification
Prove safety with concurrent tests, logs/metrics or deterministic state assertions; build success alone is insufficient.

## Failure handling
If the selected lock technology cannot provide ownership-aware release or stale recovery, reject it and choose another mechanism. After two failed implementation/test cycles, stop and escalate with preserved evidence.

## Stop conditions
Stop only when overlap semantics are explicit and the chosen mechanism has tests covering concurrent start, failure, retry, and recovery.
