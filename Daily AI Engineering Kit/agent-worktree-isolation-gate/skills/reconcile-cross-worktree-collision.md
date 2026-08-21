# Reconcile Cross-Worktree Collision

## Purpose
Safely resolve evidence that two sessions share a branch/worktree or modify overlapping paths without silently discarding, overwriting, or merging another actor's work.

## When to use
Use when `evaluate-isolation.py` reports `shared-branch`, `shared-worktree`, `path-collision`, an unexpected dirty worktree, or a handoff whose branch/revision no longer matches the session record.

## Inputs
- Current session record and isolation report
- Other active session records, if available
- Git status/diff for each affected worktree
- Repository policy
- Intended ownership/allowed paths

## Preconditions
The collision evidence must be preserved before any corrective action.

## Allowed tools
Read-only Git status, diff, log, worktree listing, branch/ref inspection, and repository file inspection. Creation of a new isolated branch/worktree is allowed when it does not destroy existing work.

## Forbidden actions
- `git reset --hard`, `git clean -fd`, forced branch moves, force push, or deleting a worktree containing changes without explicit human approval.
- Auto-stashing another actor's work.
- Treating one agent as owner merely because it observed the collision first.
- Continuing implementation while ownership is unresolved.

## Procedure
1. Freeze mutations in the affected sessions.
2. Capture current branch, HEAD, worktree path, status and changed paths for each involved session.
3. Separate facts from hypotheses: exact path overlap, branch sharing, filesystem-path sharing, and revision drift are facts; presumed ownership is not.
4. Identify whether collision is metadata-only or actual content overlap.
5. If no content overlap and ownership can be re-established safely, allocate a new branch/worktree to one session from its recorded base/current commit and regenerate its session record.
6. If content overlaps, preserve both diffs and route to human/independent coordinator for ownership or integration decision.
7. Do not cherry-pick/merge one session into another unless the integration decision explicitly authorizes it.
8. After remediation, recapture worktree state and rerun `evaluate-isolation.py` with fresh active-session data.
9. Invalidate prior test/review evidence when its worktree/branch/revision binding changed.
10. Resume only when deterministic collision blockers are cleared.

## Expected output
A fresh isolation report, explicit ownership decision, preserved collision evidence, and any new session identity required by remediation.

## Verification
No shared branch/worktree blocker remains; changed paths are within scope; evidence corresponds to the new exact HEAD/worktree; required review is fresh.

## Failure handling
No blind retries for ownership conflicts. Tool-read failures may be retried once. If another session cannot be inspected or ownership cannot be proven, stop and escalate.

## Stop conditions
Stop before destructive cleanup, history rewrite, forced branch movement, deleting data/files, or integrating overlapping changes without explicit approval.
