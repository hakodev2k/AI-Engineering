# Schema and Constraint Rules

## Purpose
Protect graph integrity through explicit, enforceable structural constraints.

## Scope
Uniqueness, existence, type, cardinality, and endpoint constraints supported by the selected graph platform.

## MUST
- Enforce machine-checkable invariants in the database when the platform supports them.
- Define uniqueness for stable business or surrogate identifiers used for matching and upserts.
- Test constraint creation against existing data before production rollout.
- Treat constraint removal or relaxation as a compatibility and data-integrity change requiring review.

## MUST NOT
- Rely solely on application code for invariants that concurrent writers can violate.
- Add a uniqueness constraint without first identifying duplicates and a remediation strategy.
- Disable constraints to make a failing import succeed without approved remediation.

## SHOULD
- Keep constraint definitions version-controlled and reproducible.
- Fail ingestion early when data violates required invariants.

## Exceptions
A deliberate absence of a supported constraint requires documented rationale, concurrency analysis, compensating controls, and approval for material integrity risk.

## Verification
Inspect deployed metadata, migration definitions, duplicate scans, negative tests, and concurrent-write tests. CI SHOULD verify that expected constraints exist in disposable environments.