# Factor Research

## Purpose
Research cross-sectional or temporal factors with controls for data mining, neutrality, implementation, and economic rationale.

## When to use
Use when proposing a new factor, combining signals, or reviewing factor decay.

## Inputs
Point-in-time universe, features, returns, classifications, risk exposures, costs, and hypothesis.

## Preconditions
Define formation time, holding period, tradable universe, and intended economic mechanism.

## Context to inspect
Existing factors, neutralization rules, winsorization, ranking, turnover, capacity, and prior experiments.

## Core knowledge
Factor returns depend on universe, weighting, neutralization, lagging, and rebalancing choices. Multiple testing and correlated variants inflate apparent significance.

## Procedure
1. State the economic hypothesis before testing.
2. Build point-in-time features with publication lags.
3. Define universe and missing-data policy.
4. Examine distributions and unintended exposures.
5. Test rank and linear relationships across time and groups.
6. Neutralize only exposures inconsistent with the hypothesis.
7. Evaluate turnover, costs, capacity, and decay.
8. Run subperiod, geography, sector, and regime robustness checks.
9. Correct interpretation for multiple variants tested.
10. Validate in a held-out chronological period.

## Decision points
Use ranks for robustness to outliers; preserve magnitude when economically meaningful and stable. Neutralization removes both unwanted risk and potentially valid signal, so justify each control.

## Common failure patterns
Publication leakage, survivorship bias, arbitrary universe changes, over-neutralization, selecting best parameter after seeing test data, and ignoring capacity.

## Verification
Reproduce factor returns, inspect exposure and turnover diagnostics, and require held-out performance consistent with the proposed mechanism.

## Expected output
A documented factor specification with robustness, implementation economics, and rejection criteria.

## Stop conditions
Stop if point-in-time data cannot be established or the factor only survives one narrow specification without economic justification.