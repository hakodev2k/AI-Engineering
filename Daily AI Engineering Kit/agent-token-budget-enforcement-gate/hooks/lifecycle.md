# Lifecycle Hooks

## Pre-task budget validation
**Trigger:** before planning expands repository context.  
**Preconditions:** policy and initial usage JSON exist.  
**Action:** run `python scripts/token_budget_gate.py --policy config/policy.yaml --usage <usage.json> --out <budget-report.json>`.  
**Expected result:** exit `0` with `pass` or `warn`; exit `3` means blocked.  
**Failure:** invalid input or policy blocks execution.  
**Blocking:** yes for validation errors and `block`.

## Post-context-expansion audit
**Trigger:** after loading a new subsystem, large logs, generated traces, or another subagent handoff.  
**Action:** update usage counts and rerun the same gate command.  
**Failure:** `warn` routes to Context Optimizer; `block` stops before more tool calls.  
**Blocking:** block status is blocking.

## Pre-verification reserve check
**Trigger:** before final build/test/review.  
**Action:** confirm verifier usage can remain within `verifier_tokens` and total budget.  
**Expected result:** sufficient reserved budget or explicit human override.  
**Blocking:** yes.

## Package integrity check
**Trigger:** after copying or modifying this kit.  
**Action:** run `python scripts/verify_package.py`.  
**Expected result:** zero exit code and required-file count.  
**Failure:** missing/reference-incomplete package blocks adoption.  
**Blocking:** yes.
