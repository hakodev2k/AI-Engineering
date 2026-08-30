# Data Contracts and Schema Evolution

## Purpose
Define enforceable producer-consumer contracts and evolve warehouse schemas without silently breaking downstream models or analytics.

## When to use
Use for shared datasets, source onboarding, schema changes, CDC pipelines, and cross-team data products.

## Inputs
Producer schema, consumer dependencies, compatibility requirements, ownership, change cadence, deployment process.

## Context to inspect
Lineage, downstream SQL, semantic models, API or event schemas, historical breakages, null/default behavior, and contract tooling.

## Core knowledge
Schema compatibility includes syntax and semantics. Additive changes can still break consumers through meaning, cardinality, units, or nullability. Breaking changes require migration windows and explicit versioning or coordinated cutovers.

## Procedure
1. Identify producer and consumer owners.
2. Define fields, types, keys, semantics, units, and freshness expectations.
3. Classify proposed changes as compatible, conditionally compatible, or breaking.
4. Inspect downstream usage through lineage and query history.
5. Add contract validation at ingestion boundaries.
6. For breaking changes, create a dual-publish or versioned migration plan.
7. Provide consumer test windows and deprecation dates.
8. Monitor adoption and remaining dependencies.
9. Remove legacy fields only after evidence shows safe retirement.
10. Record contract changes and rationale.

## Decision points
Prefer additive evolution when semantics remain stable. Version when meaning or grain changes. Use dual publishing when coordinated instant migration is unrealistic.

## Common failure patterns
Renaming columns in place, changing units without versioning, assuming nullable additions are harmless, undocumented semantic changes, and deleting fields based only on static code search.

## Verification
Run contract tests, dependency analysis, consumer validation, and post-change monitoring for query failures and metric drift.

## Expected output
A versioned, testable data contract and safe schema migration plan.

## Stop conditions
Stop breaking changes when critical consumers are unknown or migration ownership is missing.