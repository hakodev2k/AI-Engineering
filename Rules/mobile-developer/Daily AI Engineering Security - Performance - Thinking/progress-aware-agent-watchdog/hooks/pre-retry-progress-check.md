# Hook: Pre-Retry Progress Check

## Trigger
Immediately before a watchdog-triggered retry, stream reconnect, subagent restart, or forced continuation.

## Preconditions
The task has a stable ID; policy and current attempt metrics are available.

## Action
1. Persist the latest verified checkpoint/artifact hash when available.
2. Build an input record containing phase, idle time, total elapsed time, attempt number, token usage, progress signal ages, checkpoint hash, prior checkpoint hash, and identical retry-signature count.
3. Run:

```bash
python scripts/liveness_guard.py --input liveness.json --policy config/watchdog-policy.json
```

4. Record the guard output with the attempt trace.

## Expected result
- `continue`/`wait`: preserve current attempt.
- `checkpoint_retry`: terminate safely and resume from the verified checkpoint.
- `stop`: do not retry autonomously.

## Failure behavior
Invalid/missing input blocks an automatic destructive restart. Preserve the current trace/checkpoint and escalate to the orchestrator/operator.

## Blocks completion
Yes for retries. No retry may begin without a guard decision when this hook is enabled.