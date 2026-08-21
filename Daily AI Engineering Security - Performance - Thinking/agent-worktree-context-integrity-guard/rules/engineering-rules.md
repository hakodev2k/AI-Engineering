# Engineering Rules

## MUST

- MUST derive repository/worktree identity from Git process state, not from UI text, task names, directory basenames, or model memory.
- MUST capture a context contract before the first mutation in a task.
- MUST revalidate context after resume, reconnect, worktree creation, branch switch, fork, or handoff.
- MUST compare canonical repository root, canonical worktree path, and Git common directory before writes.
- MUST require exact expected branch when a branch is declared by the task contract.
- MUST record detached HEAD explicitly; empty branch output is not equivalent to “unknown.”
- MUST fail closed if a branch-expected task becomes detached or moves to another worktree.
- MUST validate context before file writes, patch application, commit, push, and branch mutation.
- MUST treat patch source base and destination base as security-relevant provenance.
- MUST stop before patch application when base compatibility cannot be established.
- MUST preserve a dirty source checkout during fork/recovery workflows.
- MUST emit deterministic mismatch reason codes and actual/expected identifiers sufficient for diagnosis.
- MUST require explicit human approval for push/branch-mutation operations when configured by policy.
- MUST bound automatic revalidation/recovery attempts; default maximum is one.

## MUST NOT

- MUST NOT trust a status bar or environment panel as the authoritative branch/worktree source.
- MUST NOT silently rewrite the expected contract to match whatever context is currently active.
- MUST NOT assume two worktrees are equivalent because they share a branch-looking name or repository basename.
- MUST NOT assume a worktree directory name identifies its branch.
- MUST NOT auto-switch branches merely to make a failed context gate pass when intent is ambiguous.
- MUST NOT apply a source diff to an unknown/stale destination base and then rely on conflict handling as validation.
- MUST NOT repeat partially successful patch application fallbacks without first restoring a known-clean destination.
- MUST NOT weaken repository/write protections to recover from a context mismatch.
- MUST NOT log file contents, credentials, auth tokens, or remote URLs containing secrets in context-audit records.
- MUST NOT allow an implementing agent to override a high-risk gate verdict by prose assertion.

## SHOULD

- SHOULD store contracts outside conversational memory and bind them to a task/run identifier.
- SHOULD use `git worktree list --porcelain` or `--porcelain -z` for scriptable worktree discovery.
- SHOULD use Git porcelain status/rev-parse/symbolic-ref rather than parsing human-formatted Git output.
- SHOULD canonicalize paths using realpath semantics and OS case-normalization before comparison.
- SHOULD record HEAD OID even for branch-attached worktrees to aid incident analysis.
- SHOULD enforce a short validation TTL for long-running sessions; 30 seconds is the package default for mutation boundaries.
- SHOULD use a separate verifier for high-risk repository-context incidents or recovery.
- SHOULD retain mismatch audit events long enough to correlate agent resume/reconnect bugs.
- SHOULD measure false blocks and tune only non-security-sensitive policy controls; never remove identity checks to improve convenience.