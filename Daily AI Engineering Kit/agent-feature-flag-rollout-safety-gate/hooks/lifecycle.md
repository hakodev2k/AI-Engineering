# Lifecycle Hooks

## Pre-rollout validation hook
**Trigger:** before any feature-flag state change.  
**Preconditions:** rollout plan exists and target environment is explicit.  
**Action:** `python scripts/validate_rollout.py --plan <plan> --policy config/policy.yaml --output rollout-result.json`.  
**Expected result:** exit `0`, `2`, or `4` with valid structured output.  
**Failure behavior:** any other exit blocks progression.  
**Blocking:** yes.

## Post-plan-edit hook
**Trigger:** plan stages, environment, thresholds, rollback, expiry, targets, or owner change.  
**Action:** invalidate prior validation and approval association; rerun validator.  
**Expected result:** current validation corresponds to current plan.  
**Failure behavior:** stop rollout.  
**Blocking:** yes.

## Post-stage-change hook
**Trigger:** after an authorized external operator changes flag state.  
**Action:** read flag state back from the provider and record activation time/cohort.  
**Expected result:** actual state exactly matches the approved stage.  
**Failure behavior:** hold progression and escalate; do not issue compensating changes autonomously.  
**Blocking:** yes.

## Stage-verification hook
**Trigger:** after minimum observation duration.  
**Action:** apply `skills/rollout-verification.md` using required telemetry and stage criteria.  
**Expected result:** one of `continue`, `hold`, `rollback`, or `inconclusive`.  
**Failure behavior:** no decision defaults to continuation.  
**Blocking:** yes.

## Final package verification hook
**Trigger:** before package completion or distribution.  
**Action:** run `python scripts/verify_package.py` and `python -m unittest tests/test_validate_rollout.py`.  
**Expected result:** both commands exit `0`.  
**Failure behavior:** package is incomplete until fixed.  
**Blocking:** yes.
