# Feature Engineering

## Purpose
Create stable, informative, reproducible model inputs without leaking unavailable future information.

## When to use
When designing tabular, temporal, ranking, or classical ML systems and when improving weak baselines.

## Inputs
Raw fields, target definition, event timestamps, domain rules, serving constraints, baseline results.

## Context to inspect
Feature availability time, null semantics, cardinality, units, leakage paths, transformations, online/offline computation.

## Core knowledge
Features must be computable at prediction time. Transformation complexity increases operational risk. Prefer domain-grounded features and reproducible pipelines over manual notebook state.

## Procedure
1. Establish an availability timestamp for each candidate feature.
2. Exclude direct and indirect target leakage.
3. Build simple raw-feature baseline.
4. Add domain transformations, aggregates, encodings, or temporal windows incrementally.
5. Fit transformations only on training partitions.
6. measure incremental value and stability.
7. Package transformations with versioned code/schema.
8. Verify equivalent serving computation.

## Decision points
Use learned representations when data volume and task justify them; use simpler engineered features when interpretability, latency, or limited data dominate.

## Common failure patterns
Global preprocessing before splitting, future-window aggregates, unstable high-cardinality encodings, duplicated feature definitions, and unbounded online joins.

## Verification
Recompute features from raw data deterministically; run leakage tests; compare offline and serving feature values on shared examples.

## Expected output
A versioned feature specification and reproducible transformation pipeline with measured contribution.

## Stop conditions
Stop when prediction-time availability cannot be proven or feature computation violates latency/privacy constraints.