# Hyperparameter and Ablation Strategy

## Purpose
Tune RL systems efficiently and attribute improvements to real design choices rather than lucky seeds, confounded changes, or excessive search over evaluation environments.

## When to use
Use when optimizing learning stability, sample efficiency, or final policy quality, and whenever a new algorithmic component is proposed.

## Inputs
- Baseline configuration
- Search budget
- Primary and constraint metrics
- Candidate hyperparameters or architectural changes

## Preconditions
A stable baseline and reproducible evaluation protocol must exist. Search and final-test environments should be separated.

## Context to inspect
Inspect sensitivity to learning rates, batch size, horizon, entropy, discounting, target updates, network scale, normalization, replay parameters, and seed variance.

## Core knowledge
RL hyperparameters interact strongly. Exhaustive search is expensive and can overfit benchmark seeds. Senior practice prioritizes high-impact parameters, uses staged search, keeps equal compute/interaction budgets, and performs ablations to isolate causal contributions.

## Procedure
1. Freeze a reference baseline and its seed distribution.
2. Rank parameters by expected impact and coupling.
3. Define bounded search ranges from algorithm semantics.
4. Tune a small set of interacting parameters together rather than independently when necessary.
5. Use early stopping only with metrics that do not bias final comparison unfairly.
6. Track total environment steps and compute for every trial.
7. Promote candidates based on multi-seed evidence, not one run.
8. Run one-factor and component-removal ablations for major claimed improvements.
9. Re-evaluate finalists on untouched scenario sets.
10. Record negative results and sensitivity ranges.

## Decision points
Prefer random or Bayesian search over dense grids in high-dimensional spaces. Stop tuning parameters with broad plateaus and focus on unstable/sensitive ones. Reject added components whose gain disappears under equal-budget ablation.

## Common failure patterns
- Best-of-many search is compared with a lightly tuned baseline.
- Multiple code changes are bundled into one experiment.
- Seed variance is mistaken for hyperparameter sensitivity.
- Search uses the final test scenarios repeatedly.

## Verification
Verify that selected settings outperform the baseline across seeds and held-out scenarios, ablations support the claimed contribution, and comparisons use comparable interaction/compute budgets.

## Expected output
A tuning record with search space, resource budget, seed-level results, sensitivity findings, ablations, and final configuration rationale.

## Stop conditions
Stop when further search yields no meaningful gain, evaluation contamination prevents unbiased comparison, or compute cost exceeds the value of expected improvement.