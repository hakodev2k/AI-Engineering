# Hook: Post-Replay Verification

## Trigger
After replay attempts finish or stop.

## Preconditions
Execution evidence contains the immutable plan hash, attempted IDs, and receipts.

## Action
1. Collect downstream application/log/queue checks.
2. Ensure one receipt exists per attempted message.
3. Mark unknown outcomes as reconciliation-required.
4. Run:

```bash
python3 scripts/verify-replay-evidence.py --evidence "$REPLAY_EVIDENCE"
```

## Expected result
Exit code 0 only for structurally consistent evidence with no unknown receipts and final status `verified`.

## Failure behavior
Block closure and preserve evidence. Never trigger an automatic replay retry.

## Blocking
Yes.
