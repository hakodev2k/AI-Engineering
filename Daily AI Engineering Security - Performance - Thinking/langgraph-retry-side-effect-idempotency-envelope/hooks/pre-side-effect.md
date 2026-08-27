# Hook: Pre-Side-Effect Claim Gate

## Trigger
Immediately before a retryable/resumable workflow executes an externally visible side effect.

## Preconditions
The operation JSON contains stable `namespace`, `operation`, and `idempotency_key`; required authorization has been evaluated separately.

## Action
Run:
```bash
python scripts/idempotency_guard.py --db <durable.db> --policy config/policy.json claim --operation <operation.json>
```

## Expected result
- `decision=execute`: caller may perform the side effect exactly once under existing authorization policy.
- `decision=reuse`: caller MUST return the stored result and MUST NOT repeat the side effect.
- `decision=wait`: caller MUST NOT execute concurrently.
- `decision=blocked`: caller MUST stop and reconcile/escalate.

## Failure behavior
Exit `2` or malformed identity blocks the side effect. Exit `3` blocks execution until the returned condition is resolved.

## Blocking
Yes. This hook is mandatory for non-idempotent external effects in retryable/resumable paths.