# Data Integrity

## Purpose
Preserve business truth during migration.

## Scope
Covers copied, transformed, backfilled, merged, split, and re-keyed data.

## MUST
- Migration logic MUST define invariants for identity, uniqueness, referential integrity, nullability, domain constraints, and required aggregates.
- Validation MUST compare source and target using deterministic checks appropriate to the transformation.
- Any integrity discrepancy MUST be triaged before declaring migration success.

## MUST NOT
- MUST NOT silently coerce, truncate, discard, or invent business data to make migration complete.
- MUST NOT rely on row counts alone where transformations can preserve counts while corrupting values.

## SHOULD
- Use checksums, reconciled aggregates, sampled record comparisons, and constraint validation in combination where appropriate.
- Preserve provenance for transformed records when operationally feasible.

## Exceptions
Intentional data loss or normalization requires documented business rationale, affected population, approval, and auditable evidence.

## Verification
Run integrity queries, constraint checks, reconciliation reports, anomaly sampling, and application-level validation.