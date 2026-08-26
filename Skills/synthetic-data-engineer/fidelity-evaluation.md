# Fidelity Evaluation

## Purpose
Measure how well synthetic data represents the statistical and semantic structure relevant to its intended use.

## When to use
For generator comparison, release gating, and drift detection.

## Inputs
Real reference partition, synthetic dataset, schema, critical slices, and fidelity thresholds.

## Context to inspect
Inspect marginals, joint distributions, conditional relationships, tails, missingness, and domain invariants.

## Core knowledge
No single distance metric establishes fidelity. Metrics must reflect downstream-sensitive structure and avoid exposing source records.

## Procedure
1. Define critical properties before seeing candidate results.
2. Compare schema and support.
3. Compare marginals with suitable distances.
4. Compare pairwise and higher-order dependencies.
5. Evaluate conditional distributions by important slices.
6. Inspect tail and rare-category coverage.
7. Validate domain constraints.
8. Visualize discrepancies without relying on plots alone.
9. Compare multiple generated seeds.
10. Report uncertainty and material gaps.

## Decision points
Weight fidelity dimensions according to downstream use; do not force exact population matching when deliberate rebalancing is required.

## Common failure patterns
One aggregate score; leakage mistaken for fidelity; ignoring rare slices; testing on generator training data only.

## Verification
Metrics are reproducible, slice-aware, and correlated with downstream utility where expected.

## Expected output
Fidelity scorecard with discrepancies and release recommendation.

## Stop conditions
Stop if reference data is not representative or fidelity metrics would expose protected information.