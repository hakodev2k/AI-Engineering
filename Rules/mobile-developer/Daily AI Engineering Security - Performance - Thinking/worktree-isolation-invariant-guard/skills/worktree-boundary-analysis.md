# Skill: Worktree Boundary Analysis

## Purpose
Establish and verify repository/worktree identity immediately before an agent performs repository-sensitive work.

## Trigger
Before file writes, Git mutations, builds/tests whose path matters, and after handoff, resume, worktree entry, branch change, or shell replacement.

## Inputs
Expected worktree root, optional expected branch, actual CWD, intended write paths, Git metadata.

## Preconditions
Expected root is assigned by trusted orchestration/configuration rather than inferred from the current shell.

## Required context
Repository boundary, worktree assignment, operation risk, and whether destructive Git actions require approval.

## Allowed tools
Read-only Git metadata commands, filesystem canonicalization, `scripts/verify_worktree.py`.

## Constraints
Do not trust HEAD SHA alone. Do not mutate Git while verifying. Do not bypass OS sandbox/permissions. A correct worktree identity does not authorize a destructive command.

## Procedure
1. Canonicalize expected root and CWD.
2. Resolve `git rev-parse --show-toplevel` and current branch.
3. Parse `git worktree list --porcelain` and verify the expected root is registered.
4. Require actual Git top-level and CWD to be inside/equal expected root.
5. If expected branch is supplied, require exact match.
6. Canonicalize every proposed write path and require it remain beneath expected root.
7. Emit observed identity and PASS/BLOCK without mutating state.
8. Re-run after handoff/resume or identity-changing operation.

## Decision points
Block on root mismatch, unregistered worktree, branch mismatch, CWD escape, or write-path escape. For destructive Git commands, proceed only after a separate explicit approval gate.

## Expected output
JSON verdict containing expected/observed root, branch, CWD, checked paths, and violations.

## Metrics
Violations caught, wrong-tree writes blocked in tests, false positives, verification latency, handoff mismatches.

## Verification
Use real temporary Git worktrees to prove correct root passes and wrong root/branch/path escape block.

## Failure handling
Treat Git/config errors as BLOCK. Do not retry a mismatch automatically; re-resolve orchestration assignment once, then escalate.

## Stop conditions
Stop on any unresolved identity mismatch, missing trusted expected root, or inability to canonicalize proposed write targets.