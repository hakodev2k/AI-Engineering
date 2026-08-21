# Hooks

## 1. Pre-Spawn Manifest Validation
**Trigger:** before any write-capable subagent is spawned.  
**Action:** validate manifest identity fields and compare ownership against all active manifests.  
**Command:** `python scripts/worktree_guard.py manifest --manifest <task.json> --active-dir <manifests/>`  
**Expected result:** exit 0 and `manifest-ok`.  
**Failure behavior:** do not spawn; replan ownership.

## 2. Workspace Preflight
**Trigger:** immediately after worktree provisioning and before worker tools are enabled.  
**Action:** assert canonical repo root, worktree path, branch, HEAD/base ancestry, and clean-start rule.  
**Command:** `python scripts/worktree_guard.py preflight --manifest <task.json>`  
**Expected result:** `workspace-ok`.  
**Failure behavior:** deny mutation permission and recreate/rebind workspace.

## 3. Pre-Write Path Gate
**Trigger:** before Edit/Write/codegen/format commands or scripts that may mutate files.  
**Action:** normalize requested paths and check ownership plus workspace identity.  
**Command:** `python scripts/worktree_guard.py write --manifest <task.json> --path <path> [--path <path> ...]`  
**Expected result:** every path allowed.  
**Failure behavior:** block write and return the violated invariant.

## 4. Concurrent-Modification Hook
**Trigger:** edit tool reports stale file, index lock, merge conflict, or file-modified-since-read.  
**Action:** increment conflict counter; allow one refresh/retry only.  
**Expected result:** success after one retry or escalation.  
**Failure behavior:** on second same-cause conflict, stop worker and emit `orchestration-conflict` handoff.

## 5. Pre-Handoff Capture
**Trigger:** worker declares completion/interruption after mutations.  
**Action:** capture base/head, changed paths, branch/worktree identity, test evidence.  
**Command:** `python scripts/verify_handoff.py build --manifest <task.json> --output <handoff.json> --test-results <tests.json>`  
**Expected result:** complete structured handoff.  
**Failure behavior:** worker may not report verified completion.

## 6. Pre-Merge Independent Verification
**Trigger:** parent/integrator receives handoff.  
**Action:** recompute git identity, diff paths, ancestry, ownership and compare with handoff.  
**Command:** `python scripts/verify_handoff.py verify --manifest <task.json> --handoff <handoff.json> --verifier <agent-id>`  
**Expected result:** `verified=true`.  
**Failure behavior:** reject merge; route to recovery/rework.

## 7. Post-Integration Verification
**Trigger:** verified worker commits are integrated.  
**Action:** run project integration tests and confirm no unexpected path changes were introduced by integration.  
**Expected result:** tests pass and integration diff is attributable.  
**Failure behavior:** stop completion; retain evidence and investigate before further merges.