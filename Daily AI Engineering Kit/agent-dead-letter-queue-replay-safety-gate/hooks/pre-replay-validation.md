# Hook: Pre-Replay Validation

## Trigger
Immediately before any queue write or provider replay command.

## Preconditions
Validated replay-plan JSON exists and is the exact file intended for execution.

## Action
Run:

```bash
python3 scripts/validate-replay-plan.py --plan "$REPLAY_PLAN" --config config/dlq-replay-gate.json
sha256sum "$REPLAY_PLAN"
```

The host executor must bind execution to the explicit `message_ids` from that same plan.

## Expected result
Validator exit code 0 and an immutable plan hash captured in execution evidence.

## Failure behavior
Any validation failure blocks replay. A changed plan must be revalidated and reapproved where applicable.

## Blocking
Yes.
