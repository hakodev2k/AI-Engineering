# Hook: Post-Cancel Terminal Guard

## Trigger
Immediately after sending MCP cancellation and on every subsequent terminal/progress/transport event for that request.

## Preconditions
Request identity, side-effect classification, cancellation reason, cancellation timestamp, and policy are available.

## Action
Evaluate current lifecycle state:

```bash
python scripts/cancellation_guard.py /path/to/request-state.json \
  --policy config/cancellation-policy.json
```

The host MUST update `request-state.json` from observed protocol events, not model claims.

## Expected result
- Exit `0`: request is terminal or still legitimately within cancellation grace.
- Exit `3`: issue cancellation or perform bounded reconciliation according to `workflows/cancel-reconcile.md`.
- Exit `4`: quarantine/block automatic retry because a side-effecting request outcome is unknown.
- Exit `2`: malformed state/policy; block automated recovery until corrected.

## Failure behavior
Do not convert an unknown request into `failed` merely to release the UI. Preserve unknown state, request/session IDs, and reason evidence. Do not automatically replay side effects.

## Blocking
Yes for retries and completion claims. The task may return a partial failure state, but it MUST NOT claim verified cancellation or safe retry while terminal outcome is unknown.
