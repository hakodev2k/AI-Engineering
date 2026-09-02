# Schema Evolution Rules

## Purpose
Prevent unsafe schema drift and preserve predictable evolution across heterogeneous engines and consumers.

## Scope
Applies to table schemas, event schemas, files, intermediate datasets, and platform-managed schema registries.

## MUST
- Schema changes MUST be evaluated against known readers, writers, serialization behavior, defaults, nullability, and historical data.
- Breaking schema changes MUST use an approved migration or versioning strategy with explicit consumer transition criteria.
- Type changes MUST account for precision, range, encoding, comparison, and engine-specific coercion behavior.
- Schema migration tooling MUST produce reviewable diffs before applying production changes.
- Critical migrations MUST define rollback or forward-fix behavior and post-change validation.

## MUST NOT
- MUST NOT depend on implicit type coercion for correctness across platform boundaries.
- MUST NOT rename fields by drop-and-add when identity or lineage semantics would be lost without review.
- MUST NOT apply destructive schema changes to production-critical data without explicit human approval.

## SHOULD
- Prefer additive compatible evolution and explicit deprecation windows.
- SHOULD automate compatibility validation in CI and deployment gates.

## Exceptions
Exceptions require rationale, impacted consumers, evidence, migration plan, risk acceptance, and appropriate approval.

## Verification
Use schema diffs, compatibility tooling, cross-engine integration tests, historical-data tests, consumer inventory review, and post-migration reconciliation.