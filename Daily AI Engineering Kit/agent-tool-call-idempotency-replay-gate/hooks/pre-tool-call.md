# Hook: Pre Tool Call

## Trigger
Immediately before a side-effecting tool invocation or replay.

## Preconditions
Execution contract exists; idempotency key and fingerprint are computed.

## Action
1. Search durable trace/store for the key.
2. If a different fingerprint or tool/operation already uses the key, block.
3. If a committed result exists, do not execute; return cached/prior result.
4. If an unknown high/critical outcome exists, block pending investigation/approval.
5. Otherwise persist a `started` event before invocation.

## Expected result
Execution is either safely deduplicated or authorized to run once.

## Failure behavior
Storage/validation uncertainty blocks mutating execution; transient storage reads retry at most twice.

## Blocking
Yes.