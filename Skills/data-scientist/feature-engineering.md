# Feature Engineering

## Purpose
Create stable, meaningful, decision-time-safe representations that improve model utility without leaking future information.

## When to use
Use when raw data does not adequately represent predictive structure or operational semantics.

## Inputs
Raw variables, target definition, event timestamps, entity relationships, model family, and serving constraints.

## Context to inspect
Data lineage, availability time, update frequency, units, missingness, cardinality, and train-serving paths.

## Core knowledge
Useful features encode domain structure while preserving temporal validity. Transformations interact with model assumptions. High-cardinality encoding, aggregation windows, normalization, and imputation can leak labels if fitted incorrectly.

## Procedure
1. Establish prediction timestamp and feature cutoff.
2. Inventory candidate variables and their availability.
3. Build domain-driven transformations and temporal aggregates.
4. Fit learned transformations only on training partitions.
5. Handle missingness and categorical variables explicitly.
6. Test stability across cohorts and time.
7. Remove redundant, unstable, prohibited, or leakage-prone features.
8. Measure incremental value using controlled validation.
9. Ensure transformations are reproducible in serving or scoring.
10. Document semantics and lineage.

## Decision points
Prefer simple interpretable features when performance is comparable. Use learned representations when scale and evidence justify complexity.

## Common failure patterns
Target leakage, future aggregates, inconsistent train-serving logic, arbitrary normalization, exploding cardinality, and feature proliferation without ablation.

## Verification
Run point-in-time correctness tests, ablations, schema checks, and train-serving parity validation.

## Expected output
A documented feature set with reproducible transformations, lineage, stability evidence, and measured contribution.

## Stop conditions
Stop when required features are unavailable at decision time or cannot be computed reliably in the target environment.