# Hook: Post Model Call Cache Telemetry

## Trigger
After every model response in an instrumented agent session.

## Preconditions
Usage metadata and request timestamp are available.

## Action
Append one normalized JSON object containing timestamp, input/cache token counters, and optional fingerprints/TTL/TTFT to a session JSONL trace. Do not log prompt contents or secrets.

## Script / command
At task end: `python scripts/cache_churn_profiler.py <thresholds.json> <trace.jsonl>`

## Expected result
A machine-readable summary plus PASS or CHURN.

## Failure behavior
Malformed/missing telemetry blocks performance conclusions but must not block the underlying safe task unless the deployment explicitly requires a cost budget.

## Blocks completion
Blocks optimization verification, not ordinary task execution.