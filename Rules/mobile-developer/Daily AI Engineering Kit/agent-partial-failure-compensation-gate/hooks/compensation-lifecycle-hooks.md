# Compensation Lifecycle Hooks

## Pre-plan validation
**Trigger:** before side-effect planning.  
**Preconditions:** repository revision and affected systems known.  
**Action:** identify every external mutation and provider outcome semantics.  
**Expected:** no hidden side effect remains.  
**Failure:** block planning if a mutation cannot be identified.  
**Blocking:** yes.

## Pre-execution plan gate
**Trigger:** before first mutation and after any plan edit.  
**Command:** `python scripts/validate-plan.py --plan workflow-plan.json --policy config/compensation-policy.json --output artifacts/plan-validation.json` then `python scripts/fingerprint-plan.py workflow-plan.json --output artifacts/plan-fingerprint.json`.  
**Expected:** validation `valid`; ledger bound to current fingerprint.  
**Failure:** stop; old review/approval bindings are stale.  
**Blocking:** yes.

## Pre-step hook
**Trigger:** immediately before each side effect.  
**Action:** refresh precondition evidence, operation key, current approval, and ledger state.  
**Expected:** no earlier step is `unknown` or unresolved `failed`.  
**Failure:** stop forward mutation.  
**Blocking:** yes.

## Post-step hook
**Trigger:** after provider response.  
**Action:** perform read-back; call `record-step-result.py` with `succeeded`, `failed`, or `unknown`; never infer success from transport response alone.  
**Expected:** durable checkpoint with evidence.  
**Failure:** persist raw response/error and mark unknown if remote effect cannot be determined.  
**Blocking:** yes on failed/unknown.

## Pre-recovery hook
**Trigger:** after partial failure.  
**Command:** `python scripts/evaluate-recovery-gate.py --plan workflow-plan.json --ledger execution-ledger.json --policy config/compensation-policy.json --review recovery-review.json --implementation-owner <owner> --output artifacts/recovery-gate.json`.  
**Expected:** `resume-ready`.  
**Failure:** reconcile/review/escalate; do not mutate.  
**Blocking:** yes.

## Post-compensation hook
**Trigger:** after each inverse action.  
**Action:** execute declared compensation verification, store evidence, and update the ledger to `compensated` only after verification.  
**Failure:** stop all further automatic compensation.  
**Blocking:** yes.

## Final verification hook
**Trigger:** before reporting completion.  
**Command:** `python scripts/evaluate-final-gate.py --plan workflow-plan.json --ledger execution-ledger.json --policy config/compensation-policy.json --output artifacts/final-gate.json`.  
**Expected:** `verified`.  
**Failure:** report blocked/partial state rather than success.  
**Blocking:** yes.
