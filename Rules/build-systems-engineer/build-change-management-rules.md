# Build Change Management Rules

## Purpose
Control changes to shared build infrastructure according to blast radius, reversibility, and evidence.

## Scope
Applies to build rules, shared macros, toolchain defaults, CI integration, cache-key behavior, target semantics, and repository-wide migrations.

## MUST
- Significant build changes MUST identify affected targets, repositories, platforms, and developer workflows before rollout.
- High-blast-radius changes MUST have staged deployment or another bounded validation mechanism.
- Compatibility changes MUST include migration instructions and a rollback or forward-fix strategy.
- Build-system migrations MUST define completion criteria and remove obsolete paths after consumers have moved.
- Evidence from representative builds MUST be collected before expanding a risky change.

## MUST NOT
- MUST NOT combine unrelated high-risk build changes in one migration when doing so obscures failure attribution.
- MUST NOT change default semantics globally without documenting impact on existing targets.
- MUST NOT keep temporary compatibility paths indefinitely without ownership and removal criteria.

## SHOULD
- Changes SHOULD be structured so old and new behavior can be compared during migration.
- Review depth SHOULD increase with fan-out, irreversibility, or release impact.

## Exceptions
Emergency changes MUST record the incident context, rationale, verification performed, rollback readiness, and required follow-up review.

## Verification
Inspect affected-target analysis, rollout plan, compatibility tests, migration status, rollback instructions, and build telemetry before and after rollout.