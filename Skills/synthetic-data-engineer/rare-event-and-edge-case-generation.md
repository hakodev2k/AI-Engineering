# Rare Event and Edge-Case Generation

## Purpose
Create controlled coverage for low-frequency but high-impact cases missing from ordinary datasets.

## When to use
For safety, fraud, reliability, robustness, anomaly, and long-tail product behavior.

## Inputs
Failure taxonomy, risk severity, known incidents, constraints, target prevalence, and validation experts.

## Context to inspect
Inspect incident reports, tail slices, near misses, domain constraints, and current coverage.

## Core knowledge
Rare-event usefulness depends on realism and boundary accuracy, not simply oversampling extreme values.

## Procedure
1. Rank rare cases by impact and coverage gap.
2. Define causal preconditions and invariants.
3. Generate controlled variants around each boundary.
4. Include near-negative cases to prevent shortcut learning.
5. Validate with domain rules/experts.
6. Avoid presenting synthetic prevalence as real prevalence.
7. Evaluate models separately on natural and stress distributions.
8. Track provenance and scenario IDs.
9. Add newly observed incidents to the taxonomy.

## Decision points
Use simulation for causal scenarios; generative synthesis for semantic variation; human construction for safety-critical ambiguous boundaries.

## Common failure patterns
Impossible catastrophes; label leakage; unrealistic prevalence; no near-negative controls; measuring only stress-set performance.

## Verification
Scenario constraints pass and target system improves on real/held-out tail cases without unacceptable normal-case regression.

## Expected output
Risk-ranked scenario library and stress-test dataset.

## Stop conditions
Stop if scenario validity cannot be established or synthetic cases could be mistaken for real incidence statistics.