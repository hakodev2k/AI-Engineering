# Worktree Isolation Governance

## MUST
- Bind every mutating agent session to a unique `session_id`, actor, immutable base revision, dedicated branch, and dedicated worktree path before edits begin.
- Capture the worktree state before edits and before final verification.
- Keep changed files inside the session's explicit `allowed_paths`; an out-of-scope path is a deterministic blocker.
- Treat shared branch, shared worktree path, or overlapping changed paths across active sessions as a blocker until reconciled.
- Preserve pre-existing user/agent changes and collision evidence before remediation.
- Re-run tests/review evidence after branch, worktree, base, or relevant content changes; evidence from a different revision/worktree is not final proof.
- Require independent review for `high`/`critical` sessions when policy enables it.
- Require explicit human approval before production deployment, destructive SQL, schema/data/file deletion, force push/history rewrite, infrastructure/secret/production-config changes, breaking API changes, security weakening, irreversible migration, or large dependency upgrade.
- Use least privilege and read-only Git inspection by default.

## MUST NOT
- Do not let two active sessions intentionally share the same mutating worktree or dedicated branch.
- Do not use `git reset --hard`, `git clean -fd`, auto-stash, branch deletion, worktree deletion, or forced ref movement to make a collision disappear without explicit authorization.
- Do not assume an uncommitted file belongs to the current agent merely because it is visible in the current checkout.
- Do not claim tests/builds from another worktree/revision verify the current session.
- Do not auto-merge/cherry-pick overlapping concurrent changes as collision remediation without an explicit integration decision.
- Do not override deterministic isolation blockers with reviewer approval.
- Do not self-review high/critical isolation evidence when policy forbids self-review.
- Do not silently broaden `allowed_paths` or weaken policy to make the gate pass.

## SHOULD
- Prefer short-lived per-task branches and sibling worktrees with human-readable session IDs.
- Store session/evidence artifacts outside product source or under ignored evidence directories.
- Keep active-session metadata machine-readable and remove it only after a verified clean handoff/closure.
- Use ownership globs narrow enough to detect accidental cross-task edits.
- Reconcile collisions before implementation continues rather than at commit time.
- Keep integration/merge as a separate controlled stage after each isolated task is independently verified.
