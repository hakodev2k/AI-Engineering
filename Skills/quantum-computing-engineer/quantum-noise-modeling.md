# Quantum Noise Modeling

## Purpose
Construct and validate noise models that are accurate enough to explain experiment behavior and guide circuit or mitigation decisions.

## When to use
Use when simulator results diverge from hardware or when estimating sensitivity to device errors.

## Inputs
Calibration data, backend properties, benchmark circuits, observed distributions, timing information.

## Context to inspect
Gate/readout error, relaxation/dephasing, crosstalk, leakage, drift, idle time, and measurement correlations.

## Core knowledge
Simple depolarizing models are useful baselines but often miss temporal and correlated effects. A more complex model is justified only when it improves predictive value.

## Procedure
1. Define observables the model must predict.
2. Start with the simplest calibrated channel model.
3. Include gate-duration and idle effects where material.
4. Validate against held-out benchmark circuits.
5. Measure residual mismatch by circuit family and depth.
6. Add correlated or non-Markovian effects only when evidence supports them.
7. Track calibration timestamp and model version.
8. Use sensitivity analysis to identify dominant noise sources.

## Decision points
Prefer simple interpretable models for design studies; use richer models only when they materially improve hardware correlation.

## Common failure patterns
Overfitting calibration snapshots, treating vendor error summaries as full models, and ignoring drift.

## Verification
Compare predicted and observed distributions/expectations across held-out circuits and time windows.

## Expected output
A versioned noise model with validation error and known limitations.

## Stop conditions
Stop when calibration is stale, hardware behavior changes faster than modeling cadence, or added complexity does not improve predictive accuracy.