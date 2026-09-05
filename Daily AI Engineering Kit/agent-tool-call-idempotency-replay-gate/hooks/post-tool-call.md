# Hook: Post Tool Call

## Trigger
After a mutating tool returns, fails, times out, or disconnects.

## Action
1. Record `committed` only with durable success evidence.
2. Record `failed` only with evidence that no side effect committed.
3. Record `unknown` for ambiguous transport/process failures.
4. Preserve provider correlation/result references.
5. Run `scripts/idempotency_gate.py` over the trace.
6. Route blocking findings to Replay Verifier/investigation.

## Expected result
Durable state accurately describes replay safety.

## Failure behavior
Failure to persist terminal state blocks automatic retry and is treated as ambiguous.

## Blocking
Yes.