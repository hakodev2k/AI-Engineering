# Hook — Pre-Compaction Budget Check

## Trigger
Before enabling or changing an automatic compaction threshold for a model/runtime pair.

## Preconditions
A snapshot JSON exists with required token quantities and active policy thresholds are known.

## Action
Run the deterministic calibrator before accepting the threshold.

## Script/command
`python scripts/context_budget_calibrator.py snapshot.json --min-headroom-ratio 0.10 --max-accounting-error-ratio 0.05`

## Expected result
Exit `0` and JSON status `pass`.

## Failure behavior
Exit `1` means invalid/incomplete telemetry; exit `2` means accounting/headroom policy violation. Preserve existing safe threshold and attach violations to the change record.

## Blocks completion
Yes. A compaction policy is not verified while this hook fails.
