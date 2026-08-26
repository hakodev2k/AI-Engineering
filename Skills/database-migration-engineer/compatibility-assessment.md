# Database Compatibility Assessment

## Purpose
Determine whether source database behavior can be reproduced safely on the target platform and identify remediation before migration execution.

## When to use
Use for engine changes, major-version upgrades, managed-service moves, or platform modernization.

## Inputs
Source and target versions, schemas, SQL and stored code, extensions, collations, data types, drivers, ORM behavior, workload samples, and vendor compatibility documentation.

## Context to inspect
Inspect syntax, procedural code, transaction semantics, isolation, identity generation, sequences, date/time behavior, collations, null ordering, JSON, spatial types, full-text search, extensions, privileges, and client drivers.

## Core knowledge
Syntactic compatibility is weaker than behavioral compatibility. Differences in implicit casts, locking, isolation, collations, precision, planner behavior, and generated values can produce silent defects.

## Procedure
1. Establish exact source and target versions.
2. Inventory engine-specific features.
3. Classify each feature as compatible, transformable, replaceable, or blocking.
4. Compare data-type semantics and precision.
5. Review transaction and concurrency behavior.
6. Test stored code and representative SQL on the target.
7. Validate drivers, ORM dialects, and connection options.
8. Record required application and schema changes.
9. Rank incompatibilities by correctness and cutover risk.
10. Build regression tests for semantic differences.

## Decision points
Prefer native target capabilities when they reduce long-term complexity; use compatibility layers only when migration risk justifies their operational cost.

## Common failure patterns
Checking only DDL import success, overlooking timezone semantics, assuming equivalent isolation levels behave identically, and accepting lossy type mappings.

## Verification
Execute compatibility tests with production-representative data and compare observable behavior, not just successful execution.

## Expected output
A compatibility matrix, remediation backlog, blockers, and validated target behaviors.

## Stop conditions
Stop when a correctness-critical source behavior has no proven target equivalent or remediation owner.