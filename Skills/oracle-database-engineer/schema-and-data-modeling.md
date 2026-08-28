# Schema and Data Modeling

## Purpose
Design Oracle schemas that preserve data integrity, support expected access patterns, and remain maintainable as volume and requirements evolve.

## When to use
Use for new domains, schema refactoring, high-growth tables, and data-model reviews.

## Inputs
Domain requirements, existing DDL, query patterns, data volumes, retention rules, integration contracts.

## Context to inspect
Keys, constraints, datatypes, nullability, sequences/identity columns, indexes, partitions, dependencies, triggers, and historical compatibility requirements.

## Core knowledge
Correct modeling starts with business invariants. Oracle-specific datatype semantics, constraint enforcement, row width, clustering, and partition choices influence correctness and performance.

## Procedure
1. Identify entities, relationships, cardinalities, and invariants.
2. Choose precise Oracle datatypes and lengths; avoid implicit conversion dependencies.
3. Define primary, unique, foreign-key, and check constraints.
4. Separate transactional truth from reporting or serving projections where appropriate.
5. Model temporal and audit requirements explicitly.
6. Design indexes from access patterns, not from every foreign key mechanically.
7. Assess partitioning only for measurable manageability or pruning benefits.
8. Review row growth, LOB handling, and retention.
9. Define migration and backward-compatibility strategy.
10. Validate representative queries and constraint behavior.

## Decision points
Normalize authoritative OLTP data when integrity dominates; denormalize deliberately for measured read-path requirements. Use surrogate keys only when they improve lifecycle or integration semantics.

## Common failure patterns
VARCHAR2-for-everything, missing constraints, implicit date/number conversions, excessive nullable columns, trigger-hidden business logic, and premature partitioning.

## Verification
Execute DDL in a clean environment, test invalid-data rejection, inspect representative plans, and validate migration scripts.

## Expected output
A documented schema with constraints, datatype rationale, indexing/partitioning decisions, and evolution rules.

## Stop conditions
Stop when core business invariants or migration compatibility requirements are unresolved.