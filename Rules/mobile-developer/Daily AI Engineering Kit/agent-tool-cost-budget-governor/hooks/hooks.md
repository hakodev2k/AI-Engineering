# Hooks

## Pre-task budget validation
**Trigger:** before any metered model/tool call.

**Preconditions:** budget plan and cost policy exist.

**Action:**
```bash
python scripts/validate_budget.py --plan budget-plan.json --policy config/cost-policy.json
```

**Expected result:** exit code 0 and `valid=true`.

**Failure behavior:** block metered execution. One plan revision is allowed; otherwise escalate.

**Blocking:** yes.

## Pre-retry spend gate
**Trigger:** before retrying a metered operation.

**Preconditions:** current spend ledger contains the previous attempt.

**Action:**
```bash
python scripts/evaluate_spend_gate.py --plan budget-plan.json --ledger spend-ledger.json --policy config/cost-policy.json --next-stage <stage> --next-operation <operation>
```

**Expected result:** `allow`.

**Failure behavior:** `human-approval-required` stops for approval; `block` stops execution.

**Blocking:** yes.

## Post-stage reconciliation
**Trigger:** after each workflow stage containing metered activity.

**Action:**
```bash
python scripts/reconcile_spend.py --plan budget-plan.json --ledger spend-ledger.json --policy config/cost-policy.json --out reconciliation.json
```

**Expected result:** reconciliation is written and exit code is 0.

**Failure behavior:** retry telemetry collection once only when the failure is transient; otherwise block.

**Blocking:** yes.

## Pre-verification reserve check
**Trigger:** before mandatory verification begins.

**Action:** run `evaluate_spend_gate.py` with `--next-stage verification`.

**Expected result:** remaining protected reserve is sufficient for the verification stage hard limit.

**Failure behavior:** block; execution budget may not be repurposed by silently removing verification.

**Blocking:** yes.

## Final cost gate
**Trigger:** before declaring the workflow verified.

**Action:** run reconciliation, then spend gate with no next operation.

**Expected result:** `allow`, no unexplained spend, no retry violation, and verification stage has evidence.

**Failure behavior:** report `executed` if applicable, but do not report `verified`.

**Blocking:** yes.