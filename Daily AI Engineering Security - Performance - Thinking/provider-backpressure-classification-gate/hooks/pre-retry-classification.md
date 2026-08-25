# Hook: Pre-Retry Classification

## Trigger
After a provider/gateway request fails with capacity/rate-limit/overload-like metadata and before any retry, fallback, credential rotation, or abort.

## Preconditions
The host can serialize `status`, optional `code`, optional `retry_after`, `attempt`, `elapsed_seconds`, and policy budgets.

## Action
Pass the event to the deterministic classifier and execute only the returned bounded action.

## Script/command
`python scripts/backpressure_classifier.py --input failure.json`

## Expected result
Exit `0` with JSON containing `action`, `reason`, and `delay_seconds` when recovery may continue. Exit `2` with `action: fail` when the cumulative recovery budget is exhausted or the error is non-retryable. Exit `1` for malformed input/configuration.

## Failure behavior
Malformed or unknown policy state fails closed to the host's bounded generic-error path. Do not silently fall through to an unbounded retry layer.

## Blocks completion
Yes. The package is not implemented if retries can bypass this classification decision on the protected path.
