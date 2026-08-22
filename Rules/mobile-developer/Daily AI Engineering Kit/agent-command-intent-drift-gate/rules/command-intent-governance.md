# Command Intent Governance

## MUST
- Capture executable, discrete arguments, target, environment, side-effect class, risk and approval action before meaningful execution.
- Bind review and final verification to deterministic intent fingerprints.
- Materialize the execution request after meaningful argument/target expansion and compare it with reviewed intent.
- Treat executable, target or environment changes as blocking drift.
- Treat side-effect escalation and any unreviewed added argument as blocking drift.
- Re-review any warning-level drift before execution.
- Require explicit human approval for production deployment, destructive SQL, database schema changes, deletion, force push/history rewrite, infrastructure/secret/production-config changes, breaking APIs, security weakening, irreversible migrations and large dependency upgrades.
- Keep execution evidence separate from intent approval evidence.
- Stop when the final command cannot be inspected precisely.
- Use least privilege and preserve drift evidence on failure.

## MUST NOT
- Execute a command because it is merely "close enough" to an approved command.
- Convert a timeout, tool error or successful exit code into proof that the reviewed intent was followed.
- Add flags, targets, namespaces, branches, tenants, databases or environments after review without revalidation.
- Hide behavior inside aliases, shell interpolation, generated scripts or environment variables to bypass review.
- Reuse a review whose intent fingerprint no longer matches.
- Allow an implementing actor to independently approve their own high/critical-risk intent when self-review is disabled.
- Broaden permissions, switch credentials or change environment to unblock execution without explicit authorization.
- Downgrade risk/side-effect classification merely to make the gate pass.
- Automatically retry deterministic drift failures.

## SHOULD
- Prefer structured tool calls over opaque shell strings.
- Prefer dry-run/plan modes before write operations when supported.
- Record resolved resource IDs instead of ambiguous display names when possible.
- Make dangerous defaults explicit in arguments.
- Re-run the gate after any plan, target, policy, adapter or argument transformation changes.
- Keep command contracts small and task-specific.
