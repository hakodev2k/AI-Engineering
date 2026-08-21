# Workflows

## Workflow A — Baseline Duplicate Execution
**Trigger:** suspected retries/replays or rollout planning.
**Goal:** quantify duplicate side effects and establish cause.
**Inputs:** traces, tool logs, provider request IDs, checkpoints, retry settings.
**Stages:**
1. Group attempts by best available business identity.
2. Count provider executions and successful effects per logical operation.
3. Label trigger: model duplicate, runtime retry, checkpoint replay, queue redelivery, unknown.
4. Record latency/cost amplification.
5. Produce baseline metrics.
**Responsible:** Replay Investigator.
**Checkpoint:** evidence must show at least one reproducible or observable duplicate path before optimization claim.
**Retry policy:** one data-query retry; otherwise record missing evidence.
**Stop:** baseline is sufficient or evidence is inadequate.
**Verification:** another reviewer can trace samples back to raw events.

## Workflow B — Guarded Side-Effect Execution
**Trigger:** write-class tool call.
**Goal:** execute at most one provider effect per logical operation while preserving retry availability.
**Stages:**
1. Validate tool classification.
2. Build stable operation key.
3. Atomically reserve ledger row.
4. If `completed`, reuse result.
5. If another valid owner is `in_progress`, bounded wait or return duplicate-in-progress.
6. If stale/`unknown`, run reconciliation.
7. Only reservation owner may execute provider call.
8. Pass native idempotency key when available.
9. Commit result/reference and mark completed.
10. Emit metrics.
**Responsible:** Guard Implementer runtime.
**Retry policy:** effect-class policy; ambiguous writes never blind retry.
**Failure path:** storage unavailable => fail closed for writes; ambiguous provider outcome => `unknown` + reconciliation.
**Definition of Done:** durable state accurately describes the operation and no second provider call was issued for a completed operation.

## Workflow C — Ambiguous Outcome Recovery
**Trigger:** timeout/reset/crash after a provider request may have been dispatched.
**Goal:** determine whether the external effect occurred before deciding to retry.
**Stages:**
1. Persist/retain `unknown` state.
2. Query provider using native idempotency/request/business key.
3. If success exists, record completed result.
4. If provider confirms absence, reacquire under same operation key and retry if policy permits.
5. If status remains unknowable after bounded reconciliation, escalate.
**Retry policy:** maximum from `config/policy.json`; no infinite polling.
**Stop:** completed, confirmed absent then bounded retry, or human escalation.
**Verification:** recovery test injects response loss after successful side effect.

## Workflow D — Rollout and Regression Gate
**Trigger:** implementation or policy change.
**Goal:** prove fewer provider executions without suppressing legitimate operations.
**Stages:** baseline → contract tests → concurrency test → crash/replay test → ambiguous-timeout test → compare metrics → independent review.
**Metrics:** duplicate provider calls, suppression rate, p50/p95 guard latency, false collision count, unknown rate, estimated avoided cost.
**Acceptance:** zero duplicate effects in required tests; no false suppression fixtures; bounded overhead target set by service owner.
**Failure:** revert/disable rollout without weakening correctness rules; preserve evidence for re-analysis.
