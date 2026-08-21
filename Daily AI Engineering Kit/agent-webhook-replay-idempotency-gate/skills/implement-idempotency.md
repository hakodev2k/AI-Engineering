# Implement Webhook Idempotency

## Purpose
Implement a crash-aware, atomic replay gate without hiding legitimate events.

## Inputs
Explorer evidence map, acceptance behavior, retention requirement, existing persistence/transaction primitives.

## Constraints
Authenticity is verified before claim. Claim creation is atomic. A reused key with a different payload hash is rejected. Business side effects never occur before a successful claim.

## Procedure
1. Add a durable idempotency record keyed by the documented provider event ID or approved composite key.
2. Store payload SHA-256, state (`processing`/`complete`) and timestamps.
3. Claim with a unique insert/conditional write inside the strongest available atomic boundary.
4. Treat an identical active/completed claim as a successful duplicate acknowledgement without re-running side effects.
5. Reject key/hash mismatch and emit evidence without logging sensitive payload content.
6. Recover stale `processing` claims only after the configured TTL and only when downstream behavior is safe to retry.
7. Mark complete after business state is durable; prefer sharing a transaction or outbox boundary where supported.
8. Add concurrency, duplicate, mismatch and crash-window tests.
9. Run deterministic tests and inspect the diff for unrelated changes.

## Expected output
Minimal code/config/test changes plus evidence describing key source, atomicity and crash behavior.

## Verification
Two concurrent identical deliveries produce at most one side-effect execution; completed duplicates are acknowledged; mismatched reuse is rejected; tests pass.

## Failure handling
Retry test/tool failures at most twice when transient. Do not retry deterministic assertion failures without a code/evidence change. Escalate when the data store cannot provide an atomic claim primitive.

## Stop conditions
Stop before schema deployment, production configuration, destructive cleanup, or security weakening pending approval.
