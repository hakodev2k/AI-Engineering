# Release and Change Approval Rules

## Purpose
Control production-impacting GraphQL changes with explicit authority, reversibility, and evidence.

## Scope
Applies to schema releases, gateway changes, resolver deployments, security policy changes, persisted-operation policy, and breaking contracts.

## MUST
- Analyze, recommend, prepare, and execute MUST be treated as distinct authority levels.
- Production deployments and production configuration changes MUST require explicit human approval when execution authority is not already granted by policy.
- Breaking public-contract changes, security-control weakening, destructive mutations, and high-risk access changes MUST require explicit human approval.
- Release plans MUST define verification and rollback or forward-recovery criteria.
- High-risk changes MUST include affected-client, dependency, and operational-impact analysis.

## MUST NOT
- MUST NOT force push, rewrite shared history, bypass required review, or silently exceed granted execution authority.
- MUST NOT weaken complexity, authentication, authorization, or validation controls merely to unblock a release.
- MUST NOT declare a rollout successful without post-deployment evidence.

## SHOULD
- SHOULD stage risky changes through canary, shadow, feature-control, or equivalent bounded exposure when feasible.
- SHOULD prefer reversible additive schema evolution.

## Exceptions
Emergency execution requires documented incident context, explicit accountable-human approval, bounded scope, and retrospective verification.

## Verification
Inspect approvals, Git history, schema diffs, rollout telemetry, change records, rollback readiness, and post-deployment checks.