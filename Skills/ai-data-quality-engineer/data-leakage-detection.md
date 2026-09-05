# Data Leakage Detection

## Purpose
Detect information leakage that causes unrealistically strong offline performance or contaminates training, validation, and test boundaries.

## When to use
Use before model release, after feature additions, when validation performance looks implausibly high, or when production performance collapses.

## Inputs
Dataset splits, feature definitions, timestamps, entity IDs, preprocessing code, label generation logic, evaluation pipeline.

## Preconditions
The prediction time and information available at that moment are understood.

## Context to inspect
Temporal joins, aggregates, target-derived fields, duplicate entities, preprocessing fit scope, feature stores, backfills, label windows.

## Core knowledge
Leakage can be target leakage, temporal leakage, entity overlap, preprocessing leakage, or operational leakage. It often survives ordinary unit tests because the data is structurally valid.

## Procedure
1. Define prediction-time information boundaries.
2. Review every feature for post-outcome information.
3. Check entity overlap across splits.
4. Check duplicate and near-duplicate records across splits.
5. Verify preprocessing is fit only on training data.
6. Audit temporal joins and aggregation windows.
7. Compare random and time-aware split performance.
8. Remove suspect features and measure metric changes.
9. Add automated leakage checks where feasible.
10. Rebuild affected evaluation baselines.

## Decision points
Use entity-grouped or time-based splitting when independence assumptions require it. Treat suspiciously large metric gains as evidence to investigate, not proof of improvement.

## Common failure patterns
Random splitting of repeated entities, fitting scalers globally, using future aggregates, and generating labels before split boundaries are applied.

## Verification
Rebuilt evaluation uses valid information boundaries and performance remains credible under leakage-resistant splits.

## Expected output
A leakage assessment, corrected split or feature logic, and refreshed evaluation baseline.

## Stop conditions
Stop when prediction-time semantics or label timing cannot be determined.