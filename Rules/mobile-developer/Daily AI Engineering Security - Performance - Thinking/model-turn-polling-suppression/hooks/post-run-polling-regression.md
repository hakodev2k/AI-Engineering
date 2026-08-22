# Hook: Post-run Polling Regression

## Trigger
After a representative agent workflow or orchestration benchmark.

## Preconditions
A JSONL trace and polling budget configuration exist; task-level correctness outcome is known.

## Action
Run the deterministic analyzer, retain its JSON output, then require task success and mandatory wakeup checks.

## Command
`python3 scripts/polling_trace_analyzer.py run.jsonl --config config/polling-budget.json`

## Expected result
Exit 0, no configured polling-budget breach, and task verification passes.

## Failure behavior
Exit 2 blocks because telemetry/config is invalid. Exit 3 blocks because the measured polling budget regressed. A task correctness/liveness failure always blocks regardless of efficiency metrics.

## Blocking
Yes. Do not complete an optimization until this hook and task-level verification pass.