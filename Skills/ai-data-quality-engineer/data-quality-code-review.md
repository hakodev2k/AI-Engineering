# Data Quality Code Review

## Purpose
Review data-processing changes for quality risks that ordinary application code review can miss, including semantic drift, hidden defaults, leakage, and weak validation.

## When to use
Use when reviewing ingestion, transformations, feature engineering, labeling, joins, filtering, sampling, backfills, or dataset publication code.

## Inputs
Code change, schemas, sample data, quality requirements, pipeline topology, tests, lineage, release plan.

## Preconditions
The reviewer can identify the downstream dataset or AI feature affected by the change.

## Context to inspect
Source semantics, join keys, null handling, timestamp logic, units, deduplication, partitioning, filters, sampling, schema evolution, validation, and observability.

## Core knowledge
Data bugs frequently produce plausible outputs rather than crashes. Senior review focuses on semantic correctness, temporal boundaries, cardinality changes, and whether failures become observable before reaching model consumers.

## Procedure
1. Identify the intended data behavior and affected consumers.
2. Trace input-to-output transformations.
3. Review schema and semantic changes separately.
4. Check joins for cardinality expansion or record loss.
5. Check timestamps and prediction-time boundaries.
6. Check null, default, and unknown-value handling.
7. Check deduplication and entity identity assumptions.
8. Review validation gates and failure behavior.
9. Inspect tests for edge cases and representative distributions.
10. Confirm lineage, versioning, monitoring, and rollback implications.
11. Request measured before-and-after evidence for material transformations.

## Decision points
Require stronger evidence for changes affecting labels, temporal logic, entity identity, or shared production features. Prefer explicit invariants over reviewer assumptions.

## Common failure patterns
Reviewing style instead of semantics, accepting joins without cardinality checks, hidden coercions, silent row filtering, fitting transforms on evaluation data, and approving changes without production monitoring.

## Verification
Tests and comparison evidence cover the identified risks, and the resulting dataset behavior is measurable after deployment.

## Expected output
A risk-focused review with actionable findings, required tests, and release conditions.

## Stop conditions
Stop approval when critical source semantics, expected cardinality, or downstream impact cannot be established.