# Hooks

## pre-plan-change-capture
**Trigger:** before test planning.  
**Preconditions:** valid Git repository and base ref.  
**Action:** `python scripts/collect-changes.py --base <base> --output artifacts/changes.json`.  
**Expected result:** complete changed-file inventory with SHA-256 fingerprint.  
**Failure behavior:** block planning.  
**Blocking:** yes.

## pre-test-plan-validation
**Trigger:** after `artifacts/test-plan.json` is produced.  
**Preconditions:** policy and plan exist.  
**Action:** `python scripts/validate-test-plan.py --plan artifacts/test-plan.json --policy config/test-selection-policy.json`.  
**Expected result:** exit 0 and JSON status `valid`.  
**Failure behavior:** block test execution until plan is corrected.  
**Blocking:** yes.

## post-test-final-gate
**Trigger:** after test execution and coverage review.  
**Preconditions:** plan, execution report, reviewer record, and policy exist.  
**Action:** `python scripts/evaluate-test-gate.py --plan artifacts/test-plan.json --execution artifacts/test-execution.json --review artifacts/coverage-review.json --policy config/test-selection-policy.json`.  
**Expected result:** JSON status `verified`.  
**Failure behavior:** `broaden-required` requires one broader test cycle; `blocked` stops completion.  
**Blocking:** yes.

## Hook safety
Hooks are read-only with respect to application data. They may create local evidence artifacts but must not deploy, mutate infrastructure, alter databases, or call production systems.