# Hook: Host Contention Regression Check

## Trigger
After a desktop-agent performance change or before release.

## Preconditions
A representative CSV trace and approved thresholds exist.

## Action
Run the deterministic profiler.

## Script/command
`python scripts/profile_contention.py <trace.csv> --thresholds config/thresholds.json --output contention-report.json`

## Expected result
Exit `0` and `"passed": true`.

## Failure behavior
Exit `2` blocks completion/release and preserves JSON findings. Exit `1` means invalid input/tool failure and also blocks completion.

## Blocks completion
Yes.
