# Hooks

## Hook — Pre-Task / Resume Bind

**Trigger:** New task, resume, reconnect, fork, or agent handoff.  
**Action:** Capture/revalidate repository-context contract from actual execution cwd.  
**Command:**

```bash
python scripts/worktree_context_guard.py capture \
  --cwd . \
  --operation write \
  --out .agent-context.json
python scripts/worktree_context_guard.py check \
  --cwd . \
  --contract .agent-context.json \
  --policy config/context-policy.json
```

**Expected result:** Exit 0.  
**Failure behavior:** Disable mutation; enter context-drift recovery. Do not auto-switch branches merely to satisfy the contract.

## Hook — Pre-File-Write

**Trigger:** Immediately before the agent modifies/creates/deletes repository files.  
**Action:** Run fresh context check; host additionally enforces `context_ttl_seconds`.  
**Command:**

```bash
python scripts/worktree_context_guard.py check --cwd . \
  --contract .agent-context.json \
  --policy config/context-policy.json \
  --operation write
```

**Expected result:** `PASS`.  
**Failure behavior:** Block the write and emit mismatch reason codes.

## Hook — Pre-Patch-Apply

**Trigger:** Before importing a diff, fork patch, or applying generated patch state.  
**Action:** Validate exact destination context, HEAD OID, and cleanliness.  
**Command:**

```bash
python scripts/worktree_context_guard.py check --cwd . \
  --contract .agent-context.json \
  --policy config/context-policy.json \
  --operation patch-apply
```

**Expected result:** Exit 0 before any patch bytes are applied.  
**Failure behavior:** Do not apply partially; require a clean compatible destination or explicit new strategy.

## Hook — Pre-Commit

**Trigger:** Before `git commit`.  
**Action:** Validate repository/worktree/branch identity.  
**Command:**

```bash
python scripts/worktree_context_guard.py check --cwd . \
  --contract .agent-context.json \
  --policy config/context-policy.json \
  --operation commit
```

**Expected result:** Exit 0.  
**Failure behavior:** Block commit; preserve index/worktree unchanged.

## Hook — Pre-Push / Branch Mutation

**Trigger:** Before push, branch rename/create/delete, forced update, or similar ref mutation.  
**Action:** Validate context, then require host-level human approval according to policy.  
**Command:**

```bash
python scripts/worktree_context_guard.py check --cwd . \
  --contract .agent-context.json \
  --policy config/context-policy.json \
  --operation push
```

For branch operations substitute `--operation branch-mutate`.

**Expected result:** Context PASS plus external approval.  
**Failure behavior:** Block. Never interpret model text as approval.

## Hook — Post-Context-Changing Git Command

**Trigger:** After `git switch`, `git checkout`, worktree creation/move, or any successful operation that changes HEAD/worktree binding.  
**Action:** Invalidate the old contract and recapture only after the orchestrator confirms the new context is intended.  
**Expected result:** New contract passes immediately.  
**Failure behavior:** Treat the session as read-only until recovery completes.

## Hook — Final Verification

**Trigger:** Before reporting task complete or handing changes to another agent.  
**Action:** Independent verifier checks context plus changed scope (`git status`, `git diff`, target branch/OID).  
**Expected result:** Context still matches approved task binding and no unexplained changes exist outside intended scope.  
**Failure behavior:** Mark task blocked/incomplete; do not hide mismatch by rewriting the contract.