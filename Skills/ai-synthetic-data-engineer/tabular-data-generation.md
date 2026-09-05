# Tabular Data Generation

## Purpose
Design and validate synthetic structured datasets that preserve required statistical, relational, and business properties without leaking sensitive records.

## When to use
Use for transactional, customer, operational, financial, healthcare, telemetry, or other structured datasets when privacy, scarcity, imbalance, or scenario control matters.

## Inputs
Schema, data dictionary, real-data statistics, constraints, keys, relationships, sensitive fields, downstream task, evaluation metrics.

## Preconditions
Data classifications and allowed source data are known. Direct identifiers are excluded unless explicitly required and governed.

## Context to inspect
Null patterns, cardinalities, correlations, temporal relationships, referential integrity, conditional distributions, outliers, rare categories, and business rules.

## Core knowledge
High-quality tabular synthesis must model more than marginal distributions. Relationships between columns, temporal order, entity consistency, and relational constraints often determine downstream usefulness. Memorization and nearest-neighbor leakage remain privacy risks.

## Procedure
1. Profile schemas and data quality before training or fitting a generator.
2. Identify hard constraints and soft statistical properties.
3. Separate identifiers from learnable attributes.
4. Choose an approach: rules, copulas, probabilistic models, GAN/VAE, diffusion/tabular transformer, or hybrid.
5. Fit using approved data and reproducible configuration.
6. Enforce keys, types, ranges, referential integrity, and domain rules.
7. Compare univariate and multivariate statistics with real data.
8. Evaluate downstream task utility on independent real validation data.
9. Run privacy attacks or similarity checks appropriate to the risk.
10. Document limitations and generation parameters.

## Decision points
Prefer rule-based generation for strict controllability; prefer learned models for complex dependencies; combine them when business constraints must be guaranteed.

## Common failure patterns
Matching histograms while breaking correlations, generating invalid foreign keys, leaking rare records, ignoring missingness patterns, and evaluating only with synthetic holdouts.

## Verification
Validate schema, constraints, distributional similarity, downstream utility, privacy metrics, and rare-segment behavior independently.

## Expected output
A reproducible structured-data generator and a validation report covering fidelity, utility, privacy, and constraints.

## Stop conditions
Stop when privacy risk exceeds threshold, required relational constraints cannot be enforced, or synthetic-to-real utility fails acceptance criteria.