# Quantum Machine Learning

## Purpose
Evaluate and implement quantum-enhanced ML workflows without confusing expressive demonstrations with measurable learning advantage.

## When to use
Use for quantum-kernel, variational classifier, generative, or hybrid-model experiments. Do not use when data-loading cost or classical baselines are ignored.

## Inputs
Dataset, task metric, classical baselines, feature dimensions, encoding method, backend, shot budget.

## Preconditions
Data splits, leakage controls, and classical evaluation protocol are established.

## Context to inspect
Feature encoding, circuit capacity, trainability, sampling variance, parameter count, class balance, preprocessing, and hardware noise.

## Core knowledge
Quantum models must be compared under equal data and tuning budgets. Encoding cost, barren plateaus, finite shots, and small effective datasets can dominate results.

## Procedure
1. Lock train/validation/test splits.
2. Establish strong classical baselines.
3. Select encoding and model family based on data structure.
4. Bound qubits, depth, parameters, and shots.
5. Test noiseless learnability first.
6. Evaluate optimization stability across seeds.
7. Run hardware/noise experiments.
8. Compare generalization, calibration, runtime, and cost.
9. Perform ablations against equivalent classical features.
10. Report uncertainty and negative results.

## Decision points
Prefer quantum kernels when pairwise circuit evaluation is manageable; prefer variational models only when trainability and shot cost are acceptable.

## Common failure patterns
Data leakage, weak classical comparison, test-set tuning, reporting training accuracy, and ignoring encoding overhead.

## Verification
Reproduce results over seeds and folds where appropriate and compare against tuned classical baselines with confidence intervals.

## Expected output
Experiment design, model rationale, resource budget, baseline comparison, reproducible metrics, and limitations.

## Stop conditions
Stop when performance claims depend on unfair baselines, unstable optimization, or infeasible data-loading/execution cost.