# Lifecycle Hooks

## Pre-plan validation
**Trigger:** before preparing a migration plan.  
**Preconditions:** target environment, engine, repository migration mechanism, and requested outcome are known.  
**Action:** confirm required context exists and production execution authority is not assigned to the planning agent.  
**Failure:** stop and collect missing evidence.  
**Blocking:** yes.

## Pre-execution gate
**Trigger:** before any migration artifact is handed to an execution mechanism.  
**Action:** run `python scripts/migration_gate.py --plan <plan.json> --policy config/policy.json --output gate-result.json`.  
**Expected:** exit `0`, `2`, or `4`.  
**Failure:** any other exit blocks execution. Exit `2` blocks; exit `4` requires approval.  
**Blocking:** yes.

## Post-plan-edit invalidation
**Trigger:** a gated or approved migration plan changes materially.  
**Action:** invalidate the previous gate/approval association and rerun the gate.  
**Failure:** block execution until current evidence exists.  
**Blocking:** yes.

## Post-execution verification
**Trigger:** authorized migration execution completes or reports failure.  
**Action:** run independent schema/migration-history/data/application checks defined by the plan.  
**Expected:** verifier returns `verified`.  
**Failure:** invoke recovery assessment; do not automatically rerun a data-changing action.  
**Blocking:** yes.

## Final package verification
**Trigger:** before accepting this kit as complete.  
**Action:** run `python scripts/verify_package.py`.  
**Expected:** all required files exist and are non-empty.  
**Failure:** package is incomplete.  
**Blocking:** yes.
