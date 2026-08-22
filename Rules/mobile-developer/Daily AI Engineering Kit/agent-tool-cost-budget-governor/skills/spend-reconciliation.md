# Skill: Spend Reconciliation

## Purpose
Reconcile actual agent/tool spend against the approved budget and produce evidence for continuation, approval, or stop decisions.

## When to use
Run after each meaningful stage, before retries of expensive operations, before spawning additional agents, and at final verification.

## Inputs
- Validated budget plan
- Spend ledger
- Policy
- Current workflow stage

## Preconditions
- Every metered operation has a ledger entry, including failed calls when they incur cost.
- Ledger entries identify stage, operation, provider/tool, amount, status, and attempt.

## Procedure
1. Validate ledger structure and numeric values.
2. Group actual spend by stage and by operation.
3. Compare actual spend with stage and task hard limits.
4. Compute remaining verification reserve separately from general remaining budget.
5. Detect repeated failures or retry consumption.
6. Detect cost anomalies: negative amounts, missing metered entries, duplicate operation-attempt keys, or unexplained spend.
7. Run `python scripts/reconcile_spend.py --plan <plan> --ledger <ledger> --policy config/cost-policy.json --out <reconciliation>`.
8. Run `python scripts/evaluate_spend_gate.py --plan <plan> --ledger <ledger> --policy config/cost-policy.json`.
9. Preserve the reconciliation output with the workflow evidence.
10. Continue only when gate status permits the next action.

## Output statuses
- `allow`: within limits and verification reserve remains protected.
- `human-approval-required`: soft threshold crossed, planned escalation is expensive, or policy-defined approval condition is met.
- `block`: hard limit exceeded, mandatory verification reserve would be consumed, ledger invalid, retry cap exceeded, or unexplained spend exists.

## Verification
The gate output must cite concrete budget and ledger values. `task executed` and `task verified` remain separate states.

## Failure handling
Transient telemetry collection may be retried once. If cost telemetry remains unavailable for a metered operation, stop rather than assuming zero cost.

## Stop conditions
Stop on `block`, after one telemetry retry, or whenever continuation would reduce mandatory verification reserve below policy minimum.