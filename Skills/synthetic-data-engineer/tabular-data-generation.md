# Tabular Data Generation

## Purpose
Generate statistically useful tabular data while preserving important dependencies and business constraints.

## When to use
For structured datasets used in analytics, ML, testing, or capacity experiments.

## Inputs
Reference data/profile, schema, constraints, target size, privacy requirements, and downstream metrics.

## Context to inspect
Inspect missingness, marginals, joint dependencies, categorical cardinality, tails, rare groups, and temporal leakage.

## Core knowledge
Matching univariate distributions is insufficient; downstream utility often depends on conditional and joint structure.

## Procedure
1. Profile reference data without exposing unnecessary rows.
2. Separate identifiers from modeled features.
3. Select generation method based on data volume and dependency complexity.
4. Encode hard constraints.
5. Fit only on approved data partitions.
6. Generate multiple seeded batches.
7. Validate distributions, dependencies, tails, and rare slices.
8. Run privacy similarity checks.
9. Measure downstream utility against baseline.
10. Record generator/version/seed.

## Decision points
Use rule/statistical generators for transparent domains; learned generators when high-dimensional dependencies justify complexity.

## Common failure patterns
Identifier memorization; mode collapse; impossible combinations; train/test leakage; ignoring tail behavior.

## Verification
Constraint pass rate, distribution distances, downstream model utility, and privacy checks meet predefined thresholds.

## Expected output
Reproducible dataset plus generation and validation report.

## Stop conditions
Stop on privacy leakage, broken critical constraints, or downstream degradation beyond threshold.