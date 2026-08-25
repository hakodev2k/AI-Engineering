# Time-Series Research

## Purpose
Design statistically defensible research on ordered financial observations while preventing leakage and false confidence.

## When to use
Use for signal discovery, forecasting, feature evaluation, or temporal relationship analysis.

## Inputs
Research hypothesis, timestamped data, sampling rules, universe definition, costs, and evaluation horizon.

## Preconditions
Confirm data provenance, availability time, and whether observations were knowable at each historical decision point.

## Context to inspect
Existing features, transformations, missing-value policy, calendar alignment, benchmark, and prior experiments.

## Core knowledge
Financial series exhibit non-stationarity, autocorrelation, heteroskedasticity, regime shifts, heavy tails, and multiple-testing risk. Statistical significance alone does not imply tradability.

## Procedure
1. State a falsifiable economic hypothesis.
2. Define target and information set at decision time.
3. Align series without future leakage.
4. Inspect stationarity, seasonality, autocorrelation, missingness, and structural breaks.
5. Select transformations justified by the hypothesis.
6. Reserve chronological validation periods before tuning.
7. Estimate uncertainty with methods appropriate to dependence.
8. Stress alternative sampling frequencies and horizons.
9. Include realistic costs and execution delay.
10. Record rejected variants as well as winners.

## Decision points
Use returns/differences when levels are non-stationary; use robust or nonparametric methods when distributional assumptions fail. Prefer simpler models unless added complexity survives out-of-sample tests.

## Common failure patterns
Random train/test splits, overlapping-label leakage, p-hacking, treating autocorrelated samples as independent, ignoring delistings, and tuning to one regime.

## Verification
Reproduce the experiment from immutable inputs, run walk-forward evaluation, inspect residual diagnostics, and compare against naive baselines.

## Expected output
A reproducible research result with assumptions, uncertainty, economic interpretation, and out-of-sample evidence.

## Stop conditions
Stop when timestamps cannot establish historical availability, sample size is inadequate, or the hypothesis changes after observing test results.