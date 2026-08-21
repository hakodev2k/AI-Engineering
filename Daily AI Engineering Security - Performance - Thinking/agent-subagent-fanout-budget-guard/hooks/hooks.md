# Hooks

## Root Task Start
**Trigger:** Before an orchestrator can delegate.
**Action:** Create root budget ledger from policy and task override approved within policy.
**Command/script:** `python scripts/budget_guard.py init --policy config/budget-policy.json --root ROOT --ledger .budget-ledger.json`
**Expected result:** Valid ledger with zero descendants and full remaining budget.
**Failure behavior:** Fail closed; no subagent spawn.

## Pre-Spawn Admission
**Trigger:** Immediately before every child spawn, including nested delegation.
**Action:** Validate parent permission and atomically reserve requested budget.
**Command/script:** `python scripts/budget_guard.py reserve --policy config/budget-policy.json --ledger .budget-ledger.json --root ROOT --parent PARENT --request-id REQ --child CHILD --tokens 12000 --tool-calls 20`
**Expected result:** Reservation ID/allowed decision.
**Failure behavior:** Do not invoke spawn API; return denial reason to orchestrator.

## Child Terminal Reconciliation
**Trigger:** Completion/failure/cancel/timeout.
**Action:** Record actual usage, preserve result pointer, release unused reservation.
**Command/script:** `python scripts/budget_guard.py reconcile --ledger .budget-ledger.json --reservation-id RID --tokens-used 9300 --tool-calls-used 14 --status completed`
**Expected result:** Updated root totals and remaining budget.
**Failure behavior:** Freeze new spawns until accounting is repaired.

## Threshold Check
**Trigger:** Usage heartbeat or after reconciliation.
**Action:** Evaluate soft/hard thresholds and fan-out anomalies.
**Command/script:** `python scripts/budget_guard.py check --policy config/budget-policy.json --ledger .budget-ledger.json`
**Expected result:** Exit 0 healthy, exit 3 soft warning, exit 4 hard violation.
**Failure behavior:** Hard violation freezes admissions and starts containment workflow.

## Final Verification
**Trigger:** Before root task reports complete.
**Action:** Assert no active/orphan reservations, limits were preserved, and final synthesis usage fits budget.
**Command/script:** `python scripts/budget_guard.py finalize --policy config/budget-policy.json --ledger .budget-ledger.json`
**Expected result:** Exit 0 with summary.
**Failure behavior:** Do not claim clean completion; surface unresolved accounting/children.