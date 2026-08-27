# Hook — Pre Retry

## Trigger
Immediately before an agent runtime repeats a failed model, tool, authentication, retrieval, or API operation.

## Preconditions
The runtime has operation attempt count, task-wide retry count, elapsed time, status/error classification, idempotency flag, and endpoint failure count.

## Action
Serialize the retry event and run:

`python scripts/retry_guard.py --event <event.json> --policy config/retry-policy.json`

## Expected result
Exit `0`: retry is allowed using the returned delay. Exit `3`: fail fast. Exit `4`: circuit is open. Exit `2`: policy/guard error.

## Failure behavior
Any guard/configuration error blocks the retry. A blocked retry returns the failure to the orchestrator rather than silently resetting counters.

## Blocking
Yes.
