# Schema Compatibility

## Purpose
Protect applications and integrations while schemas evolve.

## Scope
Covers tables, columns, constraints, indexes, types, views, procedures, and externally consumed schemas.

## MUST
- Schema changes MUST identify all known readers, writers, replication consumers, and contract dependencies.
- Breaking changes MUST use an approved compatibility sequence such as expand-migrate-contract when concurrent versions can exist.
- Constraints and type changes MUST be validated against existing data before enforcement.

## MUST NOT
- MUST NOT drop or rename a consumed object solely because the newest application version no longer uses it.
- MUST NOT assume deployment order is perfectly synchronized across services.

## SHOULD
- New fields SHOULD tolerate mixed-version operation until all dependent workloads are verified.
- Compatibility windows SHOULD have explicit retirement criteria.

## Exceptions
A direct breaking change requires evidence that no incompatible consumer can execute, documented rollback implications, and human approval.

## Verification
Inspect dependency searches, schema diffs, contract tests, mixed-version tests, migration ordering, and production telemetry.