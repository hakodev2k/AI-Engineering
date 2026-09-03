# Offline Reinforcement Learning

## Purpose
Train and evaluate policies from fixed logged datasets while controlling extrapolation error, behavioral-policy mismatch, and unsafe out-of-distribution actions.

## When to use
Use when online exploration is expensive, unsafe, regulated, or unavailable. Do not assume offline RL is feasible merely because logs exist.

## Inputs
- Logged trajectories with observations, actions, rewards, and episode boundaries
- Behavior-policy information when available
- Deployment constraints
- Baseline policies

## Preconditions
Dataset provenance and reward reconstruction must be credible. Action and state coverage must be analyzed before training.

## Context to inspect
Inspect support coverage, action frequencies, temporal leakage, logging-policy changes, missing outcomes, censoring, and distribution shift between logs and deployment.

## Core knowledge
Offline RL cannot reliably optimize actions unsupported by the dataset without strong assumptions. Distributional shift between learned and behavior policies causes extrapolation error. Conservative objectives, behavior regularization, importance weighting, and uncertainty estimates mitigate but do not eliminate this limitation.

## Procedure
1. Reconstruct episodes and validate timestamps.
2. Audit data provenance and reward correctness.
3. Measure state-action coverage and rare-action support.
4. Train behavior-cloning and simple value baselines.
5. Split data by time or environment to expose shift.
6. Select an offline RL method consistent with support limitations.
7. Track policy divergence from behavior and uncertainty on chosen actions.
8. Run off-policy evaluation with multiple estimators where justified.
9. Stress-test out-of-support states and actions.
10. Define conservative deployment gates and rollback criteria.
11. Use limited online validation only with explicit safety approval.

## Decision points
Prefer behavior cloning when logged behavior is already strong and improvement evidence is weak. Prefer conservative policy constraints when data support is narrow. Reject offline RL when critical actions have no trustworthy coverage.

## Common failure patterns
- Treating logged data as IID supervised examples.
- Optimizing into unsupported action regions.
- Reconstructing rewards inconsistently.
- Random train/test splits hide temporal distribution shift.
- Off-policy evaluation is trusted without overlap diagnostics.

## Verification
Verify coverage analysis, behavior baseline, held-out temporal performance, policy divergence, and agreement among appropriate off-policy estimators. Deployment requires explicit support and safety evidence.

## Expected output
An offline RL candidate with data-coverage report, baseline comparisons, uncertainty analysis, OPE evidence, and deployment constraints.

## Stop conditions
Stop if logs lack reliable episode/reward semantics, policy support is inadequate, OPE is non-identifiable, or deployment would require unvalidated actions.