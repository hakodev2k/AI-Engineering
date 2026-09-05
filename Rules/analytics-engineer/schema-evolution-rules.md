# Schema Evolution Rules

## Purpose
Change analytical schemas without silently breaking consumers or corrupting historical meaning.

## Scope
Applies to column additions, removals, renames, type changes, key changes, and structural migrations.

## MUST
- Schema changes MUST be classified as backward-compatible or breaking before release.
- Breaking changes MUST identify affected consumers and provide a migration or versioning strategy.
- Type changes MUST be validated against existing data ranges and downstream assumptions.
- Column removals or renames MUST observe a deprecation window when consumers cannot migrate atomically.
- Historical recomputation implications MUST be documented when semantics change.

## MUST NOT
- MUST NOT repurpose an existing column name for a different business meaning.
- MUST NOT narrow data types without proving existing values remain representable.
- MUST NOT drop consumed fields without impact analysis and approval.

## SHOULD
- Prefer additive changes and explicit versioning for widely shared datasets.
- Automate schema-diff checks in CI for governed models.

## Exceptions
Emergency breaking changes require documented impact, mitigation, communication, rollback or recovery plan, and approval.

## Verification
Inspect schema diffs, lineage, consumer references, migration plans, compatibility tests, and release records.