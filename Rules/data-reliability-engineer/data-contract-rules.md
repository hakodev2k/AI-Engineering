# Data Contract Rules

## Purpose
Keep producer-consumer expectations explicit, testable, and evolvable.

## Scope
Schemas, field semantics, nullability, units, keys, freshness expectations, ownership, and compatibility guarantees.

## MUST
- Define authoritative schema, semantics, ownership, and compatibility expectations for shared datasets.
- Validate required fields, types, keys, units, and documented invariants at ingestion boundaries.
- Review contract changes for downstream impact before release.
- Provide an explicit migration path for breaking changes.

## MUST NOT
- Change field meaning while preserving the same contract name.
- Remove or repurpose consumed fields without approved compatibility analysis.
- Treat undocumented producer behavior as a stable contract.

## SHOULD
- Version contracts using repository- or platform-supported mechanisms.
- Generate machine-checkable contract tests where practical.

## Exceptions
Exceptions require rationale, affected consumers, risk, migration plan, verification evidence, and accountable approval.

## Verification
Inspect schema diffs, contract tests, consumer compatibility checks, data catalogs, and deployment records.