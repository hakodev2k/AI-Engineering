# Hook: Pre-Retry Gate

## Trigger
Immediately before an orchestrator repeats a failed/interrupted logical operation.

## Preconditions
The current attempt has a retry key, failure signature, event list, token count, and latest checkpoint reference where available.

## Action
Append the normalized attempt record to the JSONL ledger, then run:
`python scripts/progress_circuit_breaker.py attempts.jsonl`

## Expected result
Exit code 0 permits a bounded retry. The orchestrator must still document what causal input or checkpoint differs from the previous attempt.

## Failure behavior
Exit code 3 blocks automatic retry and preserves the latest valid checkpoint. Exit code 2 indicates invalid evidence and also blocks retry.

## Blocking
Yes. Dangerous or irreversible retries additionally require explicit human approval under the surrounding platform policy.
