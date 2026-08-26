# Differential Privacy Integration

## Purpose
Integrate differential-privacy controls into synthetic-data generation when formal privacy guarantees are required.

## When to use
For sensitive source data under an approved DP threat model and privacy budget.

## Inputs
Adjacency definition, epsilon/delta policy, dataset size, training algorithm, accounting method, and utility thresholds.

## Context to inspect
Inspect preprocessing, repeated queries/training runs, composition, clipping, sampling, and prior budget consumption.

## Core knowledge
DP guarantees depend on the complete mechanism and accounting. Epsilon is not a universal safety score; utility/privacy trade-offs are domain-specific.

## Procedure
1. Define protected unit and adjacency.
2. Obtain approved privacy parameters.
3. Bound contribution and sensitivity.
4. Select a DP-capable mechanism/training method.
5. Configure clipping/noise/sampling.
6. Account for composition across runs.
7. Validate implementation against known DP tooling/tests.
8. Measure utility versus non-DP baseline.
9. Record consumed budget and prevent untracked reruns.

## Decision points
Prefer simpler aggregate DP synthesis when sufficient; use DP training for complex dependencies only when utility justifies it.

## Common failure patterns
Choosing epsilon arbitrarily; ignoring preprocessing leakage; resetting budget per experiment; reporting DP without valid accountant assumptions.

## Verification
Privacy accounting is reproducible and reviewed; utility and privacy thresholds both pass.

## Expected output
Mechanism specification, accountant report, utility comparison, and budget record.

## Stop conditions
Stop if adjacency or budget is undefined, accounting assumptions fail, or utility cannot meet minimum requirements.