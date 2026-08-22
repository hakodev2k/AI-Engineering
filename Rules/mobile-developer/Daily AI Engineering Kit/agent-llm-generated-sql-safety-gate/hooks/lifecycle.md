# Lifecycle Hooks

## Pre-SQL handoff hook
**Trigger:** before an agent passes generated SQL to any DB tool.  
**Preconditions:** SQL is saved to a file; environment is known.  
**Action:** run `python scripts/sql_safety_gate.py --sql-file <sql> --policy config/policy.yaml --environment <env> --output gate-result.json`.  
**Expected:** exit `0`, `2`, or `4` with structured JSON.  
**Failure:** any other exit blocks execution.  
**Blocking:** yes.

## Post-edit hook
**Trigger:** SQL artifact changes after a previous gate.  
**Action:** delete/invalidate stale gate/approval association and rerun the gate on the new content.  
**Expected:** current result corresponds to current SQL.  
**Failure:** block handoff.  
**Blocking:** yes.

## Pre-write hook
**Trigger:** gate exit `4` / `approval_required`.  
**Action:** require SQL Change Review plus human approval referencing exact artifact and environment.  
**Expected:** approval evidence exists before controlled external execution.  
**Failure:** stop. Never downgrade to read-only credentials to attempt a write.  
**Blocking:** yes.

## Final verification hook
**Trigger:** before declaring completion.  
**Action:** run `python scripts/verify_package.py` for package integrity; for task execution, require SQL Verifier evidence and postcondition checks.  
**Expected:** package check passes and task verification status is `verified`.  
**Failure:** report incomplete/inconclusive rather than success.  
**Blocking:** yes.
