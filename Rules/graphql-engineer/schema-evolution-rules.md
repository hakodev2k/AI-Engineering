# Schema Evolution Rules

## Purpose
Evolve GraphQL contracts without accidental client breakage or indefinite legacy accumulation.

## Scope
Applies to additions, removals, renames, nullability changes, enum changes, argument changes, and semantic behavior changes.

## MUST
- Every schema change MUST be classified as additive, behavior-changing, or breaking before release.
- Breaking changes MUST use an approved migration path and explicit human approval before production rollout.
- Deprecated fields and arguments MUST include migration guidance and a removal criterion.
- Nullability tightening, enum value removal, argument requirement changes, and semantic reinterpretation MUST be treated as potentially breaking.
- Usage evidence MUST be reviewed before removing deprecated contract elements.

## MUST NOT
- MUST NOT delete or rename externally consumed fields solely because replacement fields exist.
- MUST NOT use deprecation as permission to remove a field on an arbitrary schedule.
- MUST NOT change field meaning while preserving the same name without documented compatibility analysis.

## SHOULD
- SHOULD favor additive evolution and staged migration.
- SHOULD automate schema-diff classification in CI.

## Exceptions
Emergency breaking changes require explicit human approval, documented incident rationale, affected-client analysis, mitigation, and rollback or recovery plan.

## Verification
Use schema-diff tooling, client usage telemetry, contract tests, deprecation inventory review, and release approval records.