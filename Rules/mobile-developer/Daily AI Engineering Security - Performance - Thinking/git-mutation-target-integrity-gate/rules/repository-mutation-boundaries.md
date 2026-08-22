# Repository Mutation Boundary Rules

1. Every repository mutation MUST have an explicit resolved target before execution.
2. A push MUST NOT rely on upstream/tracking state alone to determine the remote destination when the task intent is to create or update a feature branch.
3. The effective remote branch MUST be compared with the repository default/protected branch immediately before push.
4. A default-branch push MUST be blocked unless a human approval explicitly names that branch and operation.
5. Force push to a default/protected branch MUST NOT be auto-approved.
6. Cleanup/removal targets MUST be canonicalized before authorization.
7. A cleanup target MUST be strictly contained inside an explicitly allowed managed root; equality with the managed root is allowed only when policy explicitly permits removing the whole managed worktree.
8. String-prefix comparison MUST NOT be used as the sole filesystem containment check.
9. Symlink, junction, mount, `..`, case, drive, and Windows verbatim-path differences MUST be resolved before the containment decision.
10. If the effective branch/path target is unresolved or conflicts with the planned target, the mutation MUST be blocked.
11. A dry-run SHOULD be used when the underlying tool provides one, but dry-run output MUST still be checked against policy.
12. The agent implementing a high-risk mutation MUST NOT be the only verifier.
13. Post-action verification MUST confirm that only the approved branch/path changed.
14. Failure MUST NOT be handled by disabling branch protection, broadening allowed roots, or skipping verification.
15. Evidence MUST record operation, intended target, resolved target, policy decision, approval identity/reference when applicable, and post-action verification status.