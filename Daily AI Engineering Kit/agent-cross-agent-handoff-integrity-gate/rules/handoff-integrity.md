# Cross-Agent Handoff Integrity Rules

## MUST
- Use the handoff envelope contract for every agent-to-agent transfer that changes ownership of a task.
- Separate facts, hypotheses, decisions, evidence, open questions, artifacts, and verification.
- Reference evidence IDs from every confirmed fact in `ready` or `verified` status.
- Preserve current repository/log/test evidence paths or identifiers so the consumer can reproduce claims.
- Hash local handoff artifacts with SHA-256 before transfer when artifact integrity matters.
- Mark the handoff `blocked` when required context, permissions, approvals, or evidence are missing.
- Use an independent verifier for high-risk tags before setting status to `verified`.
- Preserve failed check output when retrying.
- Stop after two retries for transient validation/tool failures.
- Require explicit human approval before production deployment, destructive data actions, schema changes, force push/history rewrite, infrastructure changes, secret changes, production configuration changes, breaking API contracts, security weakening, irreversible migrations, or large dependency upgrades.

## MUST NOT
- Present a hypothesis as a confirmed fact.
- Claim a test, build, API check, database check, or deployment succeeded unless evidence exists.
- Copy secret values, access tokens, credentials, private keys, or sensitive production data into a handoff.
- Allow the implementing agent to be the only verifier for high-risk work.
- Modify repository state solely to make a handoff validation pass.
- Silently drop unresolved questions, failed checks, or approval requirements.
- Retry indefinitely or erase evidence from previous failed attempts.
- Treat JSON/schema validity as proof that the underlying engineering task is correct.

## SHOULD
- Keep evidence concise and directly tied to the claims it supports.
- Prefer repository-relative paths and deterministic commands.
- Revalidate volatile evidence close to the consumer action.
- Keep unsupported hypotheses to the smallest useful set.
- Use narrow read-only permissions for exploration and verification agents.
- Record remaining risk even after verification when uncertainty cannot be eliminated.
