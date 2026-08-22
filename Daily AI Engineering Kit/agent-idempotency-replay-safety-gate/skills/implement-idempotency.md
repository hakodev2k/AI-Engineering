# Skill: Implement Idempotency

## Purpose
Add the smallest replay-safety mechanism that preserves one logical effect for one logical request.

## Preconditions
The investigation identifies a stable replay identity, duplicate-prone side effects, persistence boundary, and acceptance criteria.

## Process
1. Prefer a caller-supplied stable idempotency key; do not generate a new key on each retry.
2. Define scope: key plus operation/tenant when keys are not globally unique.
3. Persist a claim/result record in durable storage when the protected side effect is durable. Enforce uniqueness atomically at the database boundary.
4. Store request fingerprint when the same key with a different payload must be rejected.
5. For transactional database changes, claim the key and business mutation in the same transaction where feasible.
6. For message publication, use a transactional outbox; for consumed messages, use an inbox/deduplication record when delivery is at-least-once.
7. For external APIs, forward their supported idempotency key. If unsupported, document the residual ambiguity rather than pretending local locking protects a remote side effect.
8. Define concurrent duplicate behavior: wait/read completed result, return conflict, or return accepted. Keep it deterministic.
9. Define retention based on the maximum legitimate replay window; never silently expire keys earlier.
10. Add tests for sequential replay, concurrent replay, same-key/different-payload, crash after commit before acknowledgement, and expired-key behavior when expiry exists.
11. Build, test, inspect the diff, and hand off to an independent verifier.

## Constraints
Do not change public API contracts, schemas, production configuration, or security controls without explicit approval. Do not use process-local memory as the sole deduplication mechanism for distributed/durable work.

## Verification
Exactly one durable business effect must remain after repeated and concurrent execution with the same logical key. Different valid keys must still produce independent effects.

## Failure handling
A failed implementation/test cycle may be corrected and rerun at most twice. After that, preserve logs/diff and escalate. Never weaken assertions to obtain a pass.
