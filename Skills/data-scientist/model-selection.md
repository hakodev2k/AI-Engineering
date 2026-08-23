# Model Selection

## Purpose
Choose a model family whose accuracy, complexity, interpretability, latency, robustness, and maintenance cost fit the real decision.

## When to use
Use after establishing a baseline and valid evaluation protocol.

## Inputs
Problem type, dataset, baseline, evaluation metrics, constraints, candidate models, and serving requirements.

## Context to inspect
Sample size, dimensionality, nonlinearities, class imbalance, temporal structure, explainability needs, compute budget, and retraining cadence.

## Core knowledge
Model selection is a constrained decision, not a leaderboard exercise. Validation must isolate tuning from final evaluation. Complexity should earn its operational cost through robust incremental value.

## Procedure
1. Establish a naive and simple statistical baseline.
2. Define a small set of justified model families.
3. Build a leakage-safe validation protocol.
4. Tune candidates within comparable budgets.
5. Compare primary metrics plus calibration, stability, latency, and resource cost.
6. Evaluate important cohorts and failure cases.
7. Run ablations and sensitivity checks.
8. Prefer the simplest candidate meeting requirements.
9. Reserve untouched data for final confirmation.
10. Document rejected alternatives and rationale.

## Decision points
Use linear or generalized models for strong interpretability and low variance; trees for heterogeneous tabular interactions; specialized architectures only when data modality and evidence support them.

## Common failure patterns
Tuning on the test set, chasing tiny metric gains, unfair compute budgets, ignoring calibration, and selecting models impossible to operate reliably.

## Verification
Confirm results reproduce from fixed data/code, final evaluation was untouched during tuning, and constraints are measured rather than assumed.

## Expected output
A selected model with comparative evidence, trade-offs, and documented rationale.

## Stop conditions
Stop when evaluation is contaminated, baseline is missing, or candidate constraints cannot be measured.