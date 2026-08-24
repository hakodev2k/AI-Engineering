# Feature Pipeline Rules

## Purpose
Prevent training-serving skew and preserve stable, governed feature semantics.

## Scope
Applies to batch, streaming, offline, and online feature computation and storage.

## MUST
- Feature definitions used in production MUST have explicit semantics, type/schema, ownership, freshness expectations, and versioning strategy.
- Training and serving transformations MUST share implementation or be validated for semantic equivalence.
- Feature freshness and missing-value behavior MUST be defined for production paths.
- Breaking feature changes MUST create a new compatible version or coordinated migration.

## MUST NOT
- Online features MUST NOT silently fall back to stale or default values when doing so changes model semantics without observability.
- Point-in-time correctness MUST NOT be assumed for historical training joins; it MUST be validated where leakage is possible.

## SHOULD
- Reusable features SHOULD have automated quality checks for distribution, nulls, ranges, freshness, and schema.
- Feature computation SHOULD be idempotent where reruns are expected.

## Exceptions
A divergent training/serving implementation requires equivalence tests, documented rationale, monitoring, and approval.

## Verification
Compare offline and online feature outputs on controlled samples; inspect point-in-time joins, feature schemas, freshness metrics, fallback behavior, and compatibility tests.