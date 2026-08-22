# Hooks

## Hook 1 — Post-Plan Approval Contract Freeze
**Trigger:** Immediately after explicit plan approval and before the first mutation.
**Action:** Compile/validate contract, capture baseline, compute contract hash, persist approval binding.
**Command/script:** `python scripts/plan_scope_guard.py freeze --contract plan-contract.json --repo . --snapshot .plan-guard/baseline.json`
**Expected result:** Exit 0 and immutable baseline snapshot containing contract hash and repository baseline.
**Failure behavior:** Fail closed. Do not begin implementation.

## Hook 2 — Pre-Mutation Scope Gate
**Trigger:** Before Edit/Write/Delete/Rename, dependency update, migration, deploy, or mutating shell command.
**Action:** Validate active contract hash; classify operation and all known target paths; deny forbidden/out-of-scope targets.
**Command/script:** `python scripts/plan_scope_guard.py check --contract plan-contract.json --repo . --operation edit --path src/example.cs`
**Expected result:** Exit 0 only for authorized scope. Exit 3 means amendment required/denied.
**Failure behavior:** Prevent mutation and emit structured reason. Unknown target or operation fails closed.

## Hook 3 — Checkpoint Drift Audit
**Trigger:** After each logical implementation stage, delegation return, context compaction/resume, or before a new workaround chain.
**Action:** Compare cumulative changed files against contract and baseline.
**Command/script:** `python scripts/plan_scope_guard.py verify --contract plan-contract.json --repo . --snapshot .plan-guard/baseline.json`
**Expected result:** Every changed file maps to allowed scope.
**Failure behavior:** Stop new mutation; route to Deviation Analyst.

## Hook 4 — Final Completion Gate
**Trigger:** Before reporting task completion.
**Action:** Verify cumulative scope, contract identity, and changed-file explanation. Pair with test/acceptance-criterion verification from workflow C.
**Command/script:** `python scripts/plan_scope_guard.py verify --contract plan-contract.json --repo . --snapshot .plan-guard/baseline.json --json`
**Expected result:** Exit 0 with `scope_verified=true` and zero violations.
**Failure behavior:** Completion is Blocked; do not relabel partial work as success.

## Hook integration principle
All mutation surfaces must route through an equivalent gate. A guard attached only to one file-edit tool is insufficient when shell commands, patch tools, generated files, Git operations, subagents, or IDE integrations can mutate the same workspace.