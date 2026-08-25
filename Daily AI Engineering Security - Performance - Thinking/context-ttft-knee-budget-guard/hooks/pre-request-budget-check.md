# Hook: Pre-Request Context Budget Check

## Trigger
Immediately before a model request after calibration.

## Preconditions
A telemetry dataset and model/workload-specific calibration report exist.

## Action
Run the analyzer in gate mode with the estimated next-request input token count.

## Script/command
`python scripts/ttft_knee.py telemetry.jsonl --config config/budget.json --gate-tokens <tokens> --model <model> --workload <workload> --output ttft-budget-report.json`

## Expected result
Exit `0` when estimated input is within the soft budget.

## Failure behavior
Exit `2` blocks automatic continuation and routes to safe compaction/retrieval/thread handoff or explicit reviewed exception. Exit `1` blocks because calibration/input is invalid.

## Blocks completion
Blocks automatic continuation, not an explicit reviewed correctness exception.
