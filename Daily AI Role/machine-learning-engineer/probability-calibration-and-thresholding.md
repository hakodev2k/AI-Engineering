# Probability Calibration and Thresholding

## Purpose
Convert model scores into decision-ready probabilities and thresholds aligned with real error costs.

## When to use
Use when probabilities drive risk, prioritization, intervention or abstention decisions.

## Inputs
Scores, labels, decision costs, capacity constraints, slices and validation data.

## Context to inspect
Base-rate drift, current thresholds, downstream actions and whether scores are intended as probabilities.

## Core knowledge
Discrimination and calibration are different properties. Thresholds are policy choices and may change without retraining when costs or prevalence change.

## Procedure
1. Measure discrimination independently from calibration.
2. Plot reliability/calibration behavior and compute proper scoring metrics.
3. Fit calibration only on data separate from base-model fitting.
4. Compare Platt/logistic, isotonic or other justified calibrators.
5. Define threshold objective from business costs/capacity.
6. Evaluate threshold metrics across slices and prevalence scenarios.
7. Consider an abstention region for uncertain high-impact cases.
8. Version calibrator and threshold separately from the model.
9. Monitor calibration and decision rates in production.

## Decision points
Prefer simple parametric calibration with limited data; isotonic when enough representative data supports nonlinearity. Use global versus segment thresholds only when policy and fairness implications are understood.

## Common failure patterns
Treating logits as probabilities, calibrating on training data, thresholding at 0.5 by habit, ignoring prevalence shift and hiding policy changes inside model code.

## Verification
Check held-out calibration, decision-cost curves and slice behavior; simulate expected production prevalence.

## Expected output
Validated calibration method and explicit threshold policy.

## Stop conditions
Stop if decision costs are undefined or calibration data is not representative enough for the intended use.