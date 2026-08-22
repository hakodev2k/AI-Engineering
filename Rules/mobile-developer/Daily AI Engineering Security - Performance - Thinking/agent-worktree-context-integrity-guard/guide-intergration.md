# Integration Guide

## Goal

Integrate the guard at the orchestration boundary so repository mutations depend on fresh Git facts rather than model/session/UI state.

## 1. Copy the package

Keep at minimum:

```text
config/context-policy.json
scripts/worktree_context_guard.py
hooks/hooks.md
```

Python 3.10+ and Git are required. The script uses only the Python standard library.

## 2. Decide where the authoritative contract lives

Store `.agent-context.json` in host runtime state or a protected task directory, preferably outside files the coding agent can freely rewrite. Bind it to the task/run ID in your orchestrator.

Do not store secrets in the contract. The contract only needs repository/worktree identifiers, refs, OIDs, operation class, and timestamps.

## 3. Capture after intent is known

If the user/orchestrator selected a branch, capture that expectation explicitly:

```bash
python scripts/worktree_context_guard.py capture \
  --cwd "$TASK_CWD" \
  --operation write \
  --expected-branch "feature/payment-timeout" \
  --out "$TASK_STATE/context.json"
```

Then check immediately:

```bash
python scripts/worktree_context_guard.py check \
  --cwd "$TASK_CWD" \
  --contract "$TASK_STATE/context.json" \
  --policy config/context-policy.json \
  --operation write
```

If the check fails, do not let the agent “fix” the mismatch with arbitrary checkout/reset commands. Enter the recovery workflow.

## 4. Gate every mutation class

Map your host events to operation classes:

| Host action | Guard operation |
|---|---|
| read/search/test without mutation | `read` |
| create/edit/delete repository files | `write` |
| commit | `commit` |
| push | `push` |
| patch/fork transplant | `patch-apply` |
| switch/create/rename/delete branch | `branch-mutate` |

Run the guard before the action. Only exit code `0` unlocks it.

## 5. Enforce freshness outside the script

The default policy defines `context_ttl_seconds = 30`. Your host should remember the timestamp of the most recent successful check and require a new check when the TTL expires. Always force revalidation after:

- resume/reconnect;
- app restart;
- task fork;
- cwd change into another worktree;
- `git switch` / `checkout`;
- worktree add/move/remove/repair;
- subagent handoff.

A cached PASS from before one of these boundaries is invalid.

## 6. Integrate patch provenance

For task fork or Continue-in-worktree flows:

1. Record source base/head OIDs before generating the diff.
2. Create/select the destination worktree.
3. Capture destination contract with operation `patch-apply` while destination still has the expected HEAD.
4. Run the guard immediately before application.
5. Apply exactly once.
6. On partial failure, stop and quarantine that destination. Do not cascade repeated fallback applications.
7. Recreate a clean destination only through an explicit recovery decision.

When a clean fork is requested, do not carry the source diff at all.

## 7. Add approval boundary

The guard validates context; it does not itself grant permission to perform dangerous actions. For `push` and `branch-mutate`, require host-level human approval when `human_approval_operations` includes the requested operation.

Approval must be represented by trusted host state, not assistant prose.

## 8. Run tests

```bash
python -m unittest tests/test_worktree_context_guard.py
```

The suite covers real-repository capture/check plus wrong worktree, wrong branch, wrong Git common directory, stale patch base, and dirty patch destination.

## 9. Production rollout

Start in audit mode only for telemetry if necessary, but keep actual destructive/write controls intact. Measure:

- context checks per mutation;
- mismatch reason frequency;
- resume/reconnect mismatch rate;
- wrong-context mutation incidents;
- patch-base mismatch blocks;
- false-block investigations.

Before enforcing globally, test at least:

- standard clone;
- linked worktree;
- nested cwd inside a worktree;
- detached HEAD task;
- sparse checkout/worktree if used;
- Windows path case behavior if applicable.

## 10. Recovery contract

When a mismatch occurs:

```text
freeze writes
→ enumerate Git worktrees
→ compare actual vs expected
→ classify mismatch
→ one non-destructive recovery attempt or human selection
→ recapture contract
→ verify
```

Never solve recovery by `git reset --hard`, `git clean -fd`, force checkout, deleting worktrees, or moving dirty changes unless the user explicitly authorized that separate destructive operation.