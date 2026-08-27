# Workflow: Execute With Idempotency Envelope

**Trigger:** a retryable/resumable node is about to perform an external side effect.  
**Goal:** ensure one stable business operation produces no duplicate external effect across retries, restarts or resumes.

## Inputs
Operation identity, policy, durable claim store, side-effect function, approval state.

## Baseline
Record current duplicate-risk paths, retry policy and whether the external API has native idempotency.

## Context
Keep graph checkpoint identity distinct from business-operation identity.

## Stages
1. **Observe** — enumerate retry/resume paths and external effect.
2. **Measure baseline** — reproduce or reason from trace evidence where duplicate execution is currently possible.
3. **Diagnose** — identify the missing/non-atomic idempotency boundary.
4. **Form hypothesis** — a stable atomic claim will convert replay into reuse/wait instead of duplicate execution.
5. **Authorization checkpoint** — obtain any required human/system approval before the irreversible action.
6. **Claim** — run `idempotency_guard.py claim`.
7. **Decision** — `execute`: call side effect once; `reuse`: return stored result; `wait`: do not duplicate; `blocked`: reconcile/escalate.
8. **Complete** — persist result immediately after a successful side effect.
9. **Measure again** — run replay, concurrent and restart tests.
10. **Verify** — Reliability Verifier independently checks the evidence.

## Responsible agent
Implementation owner: stages 1–9. Reliability Verifier: stage 10.

## Tools
Claim ledger, runtime retry/checkpoint telemetry, unit/integration tests, external API documentation.

## Outputs
Operation key, claim decision, effect/result evidence, replay metrics, verification decision.

## Checkpoints
Before authorization; after claim; after external success; after persisted result; before release.

## Metrics
Duplicate-effect count, attempts/operation, claim conflicts, reuse rate, stale-claim count, replay-test coverage.

## Retry policy
Maximum attempts comes from policy. No unbounded retries. A stale/unknown external outcome is not retried automatically by default.

## Stop conditions
Missing stable identity, missing approval, unknown external outcome, exhausted attempts, ledger failure or verifier failure.

## Failure path
Do not invent a new idempotency key. Preserve claim/evidence, reconcile the external system, then either complete the original key or explicitly abandon it under human review.

## Verification
Independent verifier must reproduce all replay classes.

## Definition of Done
Stable identity documented; envelope integrated; bounded retries; one effect per key proven; authorization preserved; tests and independent verification pass.