# Multi-Repo Change Coordination Rules

## MUST
- Bind every participating repository to an immutable revision before planning and again before final verification.
- Represent proven cross-repo dependencies as directed edges with an explicit contract and compatibility classification.
- Treat `unknown` compatibility as blocking.
- Preserve rollout and rollback ordering for `requires-ordering` and `breaking` edges.
- Require concrete repository-specific verification evidence before marking a repository `ready` or `verified`.
- Replan affected edges/tests/order when any repository revision changes after review.
- Require independent review for `high` and `critical` risk.
- Require explicit human approval before production deploy, breaking contract changes, database schema/destructive changes, force-push/history rewrite, infrastructure/secret/production-config changes, security weakening, irreversible migration, or large dependency upgrades.
- Stop forward rollout immediately when a required checkpoint fails.
- Preserve failure evidence and the last known verified state before rollback.

## MUST NOT
- Do not merge/deploy one repository merely because its local tests pass when dependent repositories are not proven compatible.
- Do not infer a missing consumer is unaffected without code/config/contract evidence.
- Do not reuse a review after the plan fingerprint changes.
- Do not allow the planner/implementer to be the sole verifier for high/critical risk.
- Do not silently broaden repository scope, permissions, approvals, or deployment target.
- Do not skip rollback planning for medium+ risk.
- Do not continue rollout after revision drift until affected evidence is refreshed.
- Do not force-push to resolve coordination conflicts.

## SHOULD
- Prefer backward-compatible expand/contract changes over synchronized breaking releases.
- Prefer contract tests and machine-readable schemas over prose compatibility claims.
- Keep the dependency graph limited to directly evidenced participants, expanding only when evidence reveals another dependency.
- Verify one rollout checkpoint at a time for high-risk changes.
- Keep rollback conditions objective and executable.
