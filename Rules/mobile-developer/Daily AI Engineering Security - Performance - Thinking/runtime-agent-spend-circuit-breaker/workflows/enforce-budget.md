# Workflow: Enforce Runtime Spend Budget

## Trigger
Start of a budget-governed task and before/after every spend-producing model operation.

## Goal
Bound cumulative spend while preserving correctness-critical context and producing auditable attribution.

## Inputs
Budget policy, pricing table, task/agent IDs, source and attempt identity, token estimate, cumulative ledger, provider usage response.

## Baseline
Capture normal cost/task, p95 cost, retry share, subagent share, completion rate, and estimate error using `skills/budget-baseline.md`.

## Context
Budget enforcement is a runtime control. The model may receive remaining-budget information as guidance, but the dispatcher owns the final allow/block decision.

## Stages
### 1. Observe
Record the task topology and every path that can create a model call.

### 2. Measure baseline
Measure representative tasks without changing their behavior. Mark missing usage explicitly.

### 3. Diagnose
Identify dominant spend sources and determine whether runaway behavior is caused by retries, fan-out, oversized context, expensive routing, or normal workload cost.

### 4. Form hypothesis
Define a concrete target, for example: “A $2 task ceiling plus $1.75 wrap-up threshold will block retry storms while keeping at least 99% of successful baseline runs inside the allowed region.”

### 5. Implement
Run `scripts/spend_guard.py reserve` immediately before dispatch. Persist reservation identity with the request. On response, run `reconcile` using provider usage.

### 6. Measure again
Compare cost/task, task completion, budget blocks, estimate error, retry share, and unresolved reservations.

### 7. Improved?
- **Yes:** continue to independent verification.
- **No:** re-evaluate threshold, estimation, or workflow design. Maximum two tuning iterations.

### 8. Verify
The `subagents/cost-verifier.md` role runs deterministic tests and checks trace accounting independently.

## Responsible agent
Workflow/platform owner implements; Cost Verifier independently verifies.

## Tools
Provider usage telemetry, price table, `scripts/spend_guard.py`, Python unittest, trace store, and transactional production ledger.

## Outputs
Budget decisions, reservation/reconciliation events, before/after metrics, blocked-call evidence, and verification record.

## Checkpoints
1. Attribution coverage >= 95% before enforcement.
2. Pricing present for every allowed model.
3. Shadow simulation complete.
4. Boundary tests pass.
5. Production rollout starts with a limited workload slice.
6. Independent verification complete.

## Metrics
USD/task, tokens/task, p50/p95 spend, completion rate, hard-block count, wrap-up count, estimate error, unresolved reservation count, quality regression rate.

## Retry policy
Guard evaluation itself may retry once only for transient ledger-store errors. Model retries remain inside the original task budget. Tuning loop maximum: 2 iterations.

## Stop conditions
Stop the task when the hard limit would be exceeded, accounting state is inconsistent, model pricing is unknown under block policy, or ledger writes cannot be made durably.

## Failure path
Detection → capture ledger and request identity → block new spend → attempt one ledger recovery → if unresolved, return partial result/state and escalate to a human/platform owner. Never reset spend to zero.

## Verification
Run `python -m unittest tests/test_spend_guard.py` and validate at least one real trace against provider usage.

## Definition of Done
- **Implemented:** reservation and reconciliation are wired into all known model-call paths.
- **Measured:** baseline and after metrics exist.
- **Verified:** deterministic boundary tests pass, accounting reconciles, hard ceiling is observed, and representative task quality has no critical regression.
