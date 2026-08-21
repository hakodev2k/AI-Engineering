# Worktree Isolation Hooks

## pre-task-isolation
**Trigger:** before any repository mutation.  
**Preconditions:** session metadata and policy exist.  
**Action:** inspect `git worktree list --porcelain`, branch ownership, base revision, current path, and clean state. Run `scripts/capture-worktree-state.py --output .agent-evidence/worktree-start.json`.  
**Expected result:** dedicated branch/worktree identity is proven and start state is captured.  
**Failure:** stop before edits.  
**Blocking:** yes.

## post-edit-isolation-evaluation
**Trigger:** after an implementation batch and before build/test evidence is accepted.  
**Preconditions:** session record, current state, changed-path list, policy, and active-session registry are available.  
**Action:** run `scripts/evaluate-isolation.py` with `--phase working`.  
```bash
python scripts/evaluate-isolation.py \
  --session .agent-evidence/worktree-session.json \
  --state .agent-evidence/worktree-current.json \
  --policy config/worktree-policy.json \
  --changed-paths .agent-evidence/changed-paths.txt \
  --active-sessions .agent-evidence/active-sessions.json \
  --phase working \
  --output .agent-evidence/isolation-report.json
```
**Expected result:** `pass` or `review-required`.  
**Failure:** exit 2/blockers freeze mutation and route to collision reconciliation; exit 1 preserves tool error.  
**Blocking:** yes.

## pre-verification-fresh-state
**Trigger:** immediately before final verification.  
**Action:** recapture worktree state, regenerate changed paths, and rerun isolation evaluation with `--phase final`. This enforces clean-handoff policy and invalidates older working-phase evidence.  
```bash
python scripts/evaluate-isolation.py \
  --session .agent-evidence/worktree-session.json \
  --state .agent-evidence/worktree-current.json \
  --policy config/worktree-policy.json \
  --changed-paths .agent-evidence/changed-paths.txt \
  --active-sessions .agent-evidence/active-sessions.json \
  --phase final \
  --output .agent-evidence/isolation-report.json
```
**Expected result:** a fresh final-phase report bound to current HEAD/path/session/policy.  
**Failure:** final verification stops.  
**Blocking:** yes.

## final-isolation-gate
**Trigger:** after task-specific tests/build and required review.  
**Action:** run:
```bash
python scripts/verify-final-gate.py \
  --report .agent-evidence/isolation-report.json \
  --session .agent-evidence/worktree-session.json \
  --policy config/worktree-policy.json \
  --review .agent-evidence/isolation-review.json
```
Omit `--review` only when policy/risk/report do not require review. The gate requires `phase=final`, verifies report self-integrity, and rebinds the report to the current session and policy.  
**Expected result:** `verified`, exit 0.  
**Failure:** block completion.  
**Blocking:** yes.

## approval-boundary
**Trigger:** before destructive cleanup, worktree/file deletion, forced ref/history change, production deployment/configuration, schema/data changes, secret/infrastructure changes, breaking API/security changes, irreversible migration, or large dependency upgrade.  
**Action:** stop and request explicit human approval for the exact action and scope.  
**Failure:** no action is executed.  
**Blocking:** yes.

## post-handoff
**Trigger:** after successful final gate.  
**Action:** emit exact session ID, branch, HEAD, worktree path, changed paths, test/build evidence references, isolation fingerprint, review status, and residual risks. Do not delete the worktree automatically when uncommitted or unintegrated work remains.  
**Blocking:** no, except missing required handoff fields make the workflow incomplete.
