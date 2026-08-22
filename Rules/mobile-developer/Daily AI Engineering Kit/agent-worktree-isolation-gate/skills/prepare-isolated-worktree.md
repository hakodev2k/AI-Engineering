# Prepare Isolated Worktree

## Purpose
Create and register a dedicated Git worktree/branch before an AI agent edits files so concurrent tasks cannot contaminate each other's uncommitted changes, test evidence, or commit scope.

## When to use
Use before any implementation, refactor, bug fix, test generation, migration work, release preparation, or other repository mutation that may run concurrently with another human or agent task.

## Inputs
- Repository root
- Immutable base revision
- Unique session ID and actor ID
- Dedicated branch name
- Dedicated worktree path
- Allowed path globs
- Risk classification: `low`, `medium`, `high`, or `critical`

## Preconditions
- Git is available.
- Base revision resolves successfully.
- The requested worktree path is not already owned by another active session.
- The branch is not owned by another active session.
- Dangerous operations such as force push remain outside this skill and require explicit human approval.

## Allowed tools
Read-only Git inspection plus non-destructive `git worktree add` / branch creation when permitted by the host workflow.

## Constraints
- Never reuse a dirty shared checkout as the isolated worktree.
- Never delete another worktree or branch to resolve a collision automatically.
- Never reset, clean, stash, or discard pre-existing user changes without explicit approval.

## Procedure
1. Resolve the exact base revision with `git rev-parse` and record it.
2. Inspect `git worktree list --porcelain` and active-session metadata.
3. Fail if the requested worktree path or branch is already owned by another active session.
4. Confirm the source checkout is understood; do not absorb unrelated dirty state.
5. Create a dedicated branch/worktree from the recorded base revision using the repository's approved naming convention.
6. Enter the dedicated worktree and run `scripts/capture-worktree-state.py`.
7. Confirm the worktree path and branch match the session contract.
8. Record whether the isolated worktree is clean before any agent edit. A dirty start is blocking when policy requires clean start.
9. Persist a `worktree-session` record containing the exact base revision, actor, branch, worktree path, allowed paths, start time, and risk.
10. Only then hand the isolated worktree to the implementation agent.

## Expected output
A validated session record plus a captured worktree-state artifact bound to one branch and one filesystem worktree path.

## Verification
- `git rev-parse --abbrev-ref HEAD` equals the session branch.
- Current resolved path equals the session worktree path.
- `git worktree list --porcelain` contains that path and branch pairing.
- Clean-start policy is satisfied.
- No active session owns the same branch or worktree path.

## Failure handling
Transient read-only Git inspection may be retried once. Validation/collision failures are not automatically retried; preserve evidence and choose a new branch/worktree or escalate.

## Stop conditions
Stop before editing if branch/path ownership is ambiguous, the isolated checkout is dirty unexpectedly, the base revision cannot be resolved, or fixing the condition would require deleting/resetting/stashing another user's work.
