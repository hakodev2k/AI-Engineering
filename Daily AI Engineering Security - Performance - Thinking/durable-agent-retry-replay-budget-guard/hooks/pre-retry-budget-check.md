# Hook — Pre-retry Budget Check

## Trigger
Immediately before any runtime, workflow, or subagent retry that may repeat model or tool work.

## Preconditions
Attempt history, request fingerprint, checkpoint/progress state, and budget counters are available.

## Action
Build a minimal JSON envelope with current attempt count, current/previous fingerprint, progress flags, checkpoint ID, replayed-token estimate, post-failure tool calls, post-failure wall time, and whether this is a full-turn replay. Run the retry gate.

## Script / command
`python scripts/retry_gate.py retry.json --config config/retry-budget.json`

## Expected result
Exit `0` permits bounded retry/resume. Exit `3` requires escalation/reconciliation before another expensive call. Exit `4` stops automatic retry. Exit `2` indicates invalid state/configuration.

## Failure behavior
Do not automatically replay expensive work on non-zero exit. Preserve sanitized counters and decision reasons. Escalation may continue only after state/request changes are explicitly recorded.

## Blocks completion
Yes for automatic retry. The runtime MUST NOT bypass the hook merely because a provider SDK or durable framework labels the failure retryable.
