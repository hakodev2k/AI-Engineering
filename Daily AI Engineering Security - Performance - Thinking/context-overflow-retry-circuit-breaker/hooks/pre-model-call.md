# Hook: Pre Model Call

## Trigger
Immediately before every model request and immediately after any provider error that may indicate context overflow.

## Preconditions
Token estimate, immutable-token count, context limit, reserved output, compaction count, and retry-signature count are available.

## Action
Serialize the event and run:
`python scripts/overflow_circuit_breaker.py --event <event.json> --policy config/policy.json`

## Expected result
Exit 0: request may proceed. Exit 3: compact evictable context and re-measure before retry. Exit 4: fail fast and surface the reason. Exit 2: malformed hook input.

## Failure behavior
Do not fall through from a capacity failure into generic retry logic. Preserve required context and return an actionable failure reason.

## Blocks completion
Yes when overflow is unresolved or compaction/retry budgets are exhausted.
