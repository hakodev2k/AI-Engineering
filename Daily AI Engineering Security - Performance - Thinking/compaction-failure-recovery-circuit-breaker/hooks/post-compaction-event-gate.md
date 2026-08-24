# Hook: Post-Compaction Event Gate

## Trigger
After appending any compaction start/success/failure/checkpoint/session-end event to normalized telemetry.

## Preconditions
JSONL event log is append-only for the current session; recovery policy is available.

## Action
Evaluate the complete bounded event tail using the guard.

## Command
```bash
python scripts/compaction_guard.py --input "$SESSION_COMPACTION_EVENTS" --policy config/recovery-policy.json
```

## Expected result
Exit `0` with `decision: continue` for a healthy lifecycle.

## Failure behavior
Exit `2` blocks additional automatic compaction retries and blocks reporting the session as successfully complete. Preserve the event log and initiate `workflows/compaction-recovery.md`.

## Blocks completion
Yes whenever the circuit is open or premature termination is detected.