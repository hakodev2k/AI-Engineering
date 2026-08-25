# Hook — Pre-Regression-Claim Gate

## Trigger
Before reporting a Windows desktop performance regression as fixed or assigning it to a subsystem.

## Preconditions
Baseline/current CSV files and policy exist.

## Action
Run:

`python3 scripts/analyze_regression.py baseline.csv current.csv --policy config/regression-policy.json --output regression-report.json`

## Script/command
`scripts/analyze_regression.py`

## Expected result
Exit `0` for no blocking measured regression in the current/fixed scenario.

## Failure behavior
Exit `2` means measured regression or insufficient evidence; exit `3` means invalid data/config.

## Blocking
Yes for the performance claim. It does not block unrelated safe functionality.
