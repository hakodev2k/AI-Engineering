# Skill: Implement Verification and Replay Safety

## Purpose
Apply the smallest safe change that enforces webhook authenticity, freshness, and replay resistance.

## Inputs
Explorer findings, provider signing contract, target files, existing tests, policy.

## Preconditions
Signed payload semantics and side-effect boundary are known.

## Allowed tools
Repository edit, local tests, formatter/linter, deterministic package script, diff inspection.

## Constraints
Do not change public contracts, secret infrastructure, database schema, or production configuration without approval.

## Process
1. Capture raw body before framework transformations when required.
2. Fail closed on missing required headers.
3. Parse timestamp strictly and reject out-of-window values.
4. Construct signed payload exactly as specified by provider.
5. Compute expected HMAC with configured algorithm.
6. Decode supplied signature deterministically and compare using constant-time equality.
7. Derive replay identity from provider event/delivery ID.
8. Atomically claim identity before non-idempotent side effects.
9. Define duplicate outcome without repeating side effects.
10. Add positive and negative tests, including tamper, stale timestamp, missing headers, malformed signature, sequential duplicate, and concurrent duplicate.
11. Run repository tests and inspect the diff for unrelated changes.
12. Maximum implementation/test-fix cycles: 3.

## Expected output
Minimal implementation diff, tests, evidence of verification ordering, and remaining risk.

## Verification
Independent verifier confirms negative tests and replay race behavior; package deterministic tests pass.

## Stop conditions
Stop before any approval-required action or when atomic replay semantics cannot be guaranteed by the current storage API.