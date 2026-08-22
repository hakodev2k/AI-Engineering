# Hook: Post-failure Retry Gate

## Trigger
Immediately after an MCP call fails and before scheduling another attempt.

## Preconditions
Failure code/message, server identity, method, capability epoch, and prior attempt count are available.

## Action
Classify the failure using `skills/capability-failure-classification.md`, persist breaker state, and run the retry trace analyzer in verification environments.

## Command
`python3 scripts/retry_trace_analyzer.py retry-events.jsonl --transient-max 4`

## Expected result
No unsupported-terminal retry and no retry budget violation.

## Failure behavior
Exit 2 blocks retry because telemetry/config is invalid. Exit 3 blocks retry because a circuit-breaker rule was violated. Unknown failures get only one diagnostic retry.

## Blocking
Yes for the retry being scheduled. It does not block unrelated MCP methods or servers.