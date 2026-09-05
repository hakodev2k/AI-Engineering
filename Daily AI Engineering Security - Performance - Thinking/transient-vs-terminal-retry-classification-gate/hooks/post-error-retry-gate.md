# Hook: Post-Error Retry Gate

## Trigger
After a model, provider, transport, or tool operation returns an error and before another attempt is scheduled.

## Preconditions
The caller has normalized the error class and maintains a shared retry-episode ledger.

## Action
Evaluate the current episode against deterministic retry policy.

## Script / command
`python scripts/retry_guard.py config/retry-policy.example.json <event.json>`

## Expected result
Exit 0 means exactly one retry may be scheduled using the returned bounded delay. Exit 4 means STOP and propagate a terminal result. Exit 1 means invalid input/policy and blocks automatic retry.

## Failure behavior
Do not default to retry. Preserve sanitized evidence and terminate/escalate when the gate cannot make a valid decision.

## Blocks completion
A STOP blocks further automatic retry, not task reporting. The outer workflow must accurately report the terminal failure instead of pretending success.