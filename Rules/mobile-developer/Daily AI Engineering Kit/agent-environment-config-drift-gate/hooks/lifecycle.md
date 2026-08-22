# Lifecycle Hooks

## Pre-deployment drift hook
**Trigger:** before an AI-assisted deployment, environment edit, or release approval.  
**Preconditions:** baseline/current snapshots and environment are known.  
**Action:** run `python scripts/config_drift_gate.py --baseline <baseline> --current <current> --policy config/policy.yaml --environment <env> --output drift-result.json`.  
**Expected result:** exit `0`, `2`, or `4` with structured JSON.  
**Failure behavior:** any other non-zero exit blocks progression.  
**Blocking:** yes.

## Post-snapshot hook
**Trigger:** after baseline/current snapshot regeneration.  
**Action:** validate parseability, confirm sensitive values are masked, then rerun the gate.  
**Expected result:** gate output corresponds to the latest snapshot files.  
**Failure behavior:** invalidate stale gate evidence and stop.  
**Blocking:** yes.

## Pre-approval hook
**Trigger:** exit `4` / `approval_required`.  
**Action:** require investigation evidence and a completed `templates/config-change-approval.md` targeting exact environment and keys.  
**Expected result:** explicit human approval exists before external mutation.  
**Failure behavior:** stop; never auto-approve.  
**Blocking:** yes.

## Post-change verification hook
**Trigger:** after an externally executed approved configuration change.  
**Action:** capture a fresh masked snapshot, rerun the gate, then invoke Drift Verifier.  
**Expected result:** expected drift is resolved and no new blocking drift appears.  
**Failure behavior:** stop and escalate; do not auto-reconcile.  
**Blocking:** yes.

## Package integrity hook
**Trigger:** before declaring the kit complete after copying/customizing it.  
**Action:** run `python scripts/verify_package.py`.  
**Expected result:** exit `0`.  
**Failure behavior:** package is incomplete.  
**Blocking:** yes.
