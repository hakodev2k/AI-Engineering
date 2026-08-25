# Hook: Pre-Request Context Health

## Trigger
Immediately before a high-cost model request when context is near policy thresholds, or after a recent long-context transport failure.

## Preconditions
Telemetry JSON refers to the active session and model/provider path.

## Action
Run `python scripts/context_recovery_guard.py telemetry.json`.

## Expected result
Exit `0` permits the turn. Exit `10` requires compaction before continuing. Exit `20` requires verified state export and fresh-context recovery. Exit `30` blocks because reserve/limit safety is insufficient. Exit `2` means invalid evidence.

## Failure behavior
Do not convert non-zero exit codes into warnings. Do not retry the model request until the selected condition materially changes.

## Blocks completion
Yes for exit `20`, `30`, or `2` until the corresponding recovery/evidence requirement is satisfied.
