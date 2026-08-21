# Hook: Pre-Dispatch Backpressure Check

## Trigger
Immediately before agent delegation or side-effecting tool/API dispatch.

## Preconditions
Capacity policy and current runtime counters are available.

## Action
Run `python scripts/backpressure_guard.py request.json --policy config/capacity-policy.json`.

## Expected result
Exit 0 = dispatch allowed; exit 3 = bounded delay; exit 4 = shed/stop; exit 2 = invalid input/config.

## Failure behavior
Invalid policy/input blocks dispatch. Delay schedules only one bounded retry attempt. Shed/stop returns a structured reason to the orchestrator.

## Blocks completion
Yes when policy is invalid or task budget/deadline is exhausted. A blocked dispatch must never be silently converted to success.
