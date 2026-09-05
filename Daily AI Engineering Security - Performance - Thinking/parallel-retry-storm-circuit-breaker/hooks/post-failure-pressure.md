# Hook: Post-Failure Retry Pressure

## Trigger
After a retryable provider/tool failure in a parallel workflow and before scheduling another attempt.

## Preconditions
A workflow-level retry state exists with timestamps, failure outcomes, current concurrency, and attempt counts.

## Action
Append the event, evaluate circuit state, and block/reduce new attempts when configured pressure thresholds are exceeded.

## Script / command
`python scripts/retry_storm_guard.py --config config/circuit.example.json --events examples/throttled-events.jsonl`

## Expected result
Exit 0 = CLOSED/continue within policy; exit 3 = HALF_OPEN/restrict to probe concurrency; exit 4 = OPEN/stop new retries until cooldown.

## Failure behavior
Invalid trace/config exits 1 and blocks automatic retry. Existing successful outputs remain checkpointed.

## Blocks completion
An OPEN decision blocks further automatic fan-out for that dependency during the cooldown. It does not discard completed work.