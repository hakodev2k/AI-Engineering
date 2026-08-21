# Hooks: Branch Base Drift Replan Gate

## Pre-plan baseline
- **Trigger:** before implementation begins from a plan.
- **Preconditions:** target/head refs resolve.
- **Action:** run `python scripts/capture-branch-baseline.py --repo <repo> --target <target-ref> --head <head-ref> --plan <plan-json> --output <baseline-json>` then validate it.
- **Expected result:** validated baseline bound to target/head/merge-base.
- **Failure behavior:** block implementation.
- **Blocking:** yes.

## Resume freshness check
- **Trigger:** before resuming a paused task or delegated step.
- **Preconditions:** baseline exists.
- **Action:** run `python scripts/evaluate-branch-drift.py --repo <repo> --record <baseline-or-replan-json> --policy config/drift-policy.json --output <drift-report-json>`.
- **Expected result:** `fresh`, `replan-required`, or `review-required`.
- **Failure behavior:** block on invalid/unknown result; replan on material drift.
- **Blocking:** yes.

## Pre-PR final gate
- **Trigger:** before claiming PR/change is ready.
- **Preconditions:** latest replan record and drift report exist; reviewer record supplied when required.
- **Action:** run `python scripts/evaluate-replan-gate.py --record <record> --drift <drift-report> --policy config/drift-policy.json [--review <review-json>] --output <gate-json>`.
- **Expected result:** `verified`.
- **Failure behavior:** block PR completion and preserve reasons.
- **Blocking:** yes.

## Post-target-change invalidation
- **Trigger:** target branch/ref SHA changes after review or gate evaluation.
- **Action:** mark prior drift/review/gate evidence stale and rerun drift evaluation.
- **Expected result:** evidence bound to current refs.
- **Failure behavior:** do not reuse old approval/review/gate state.
- **Blocking:** yes.