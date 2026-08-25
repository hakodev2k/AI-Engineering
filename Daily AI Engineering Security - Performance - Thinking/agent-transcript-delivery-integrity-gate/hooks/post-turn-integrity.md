# Hook: Post-Turn Delivery Integrity

## Trigger
After transcript flush and before marking a tool-heavy turn verified.

## Preconditions
Emission and persistence ledgers exist and use the required schema.

## Action
Run the deterministic reconciliation script.

## Command
```bash
python scripts/transcript_guard.py --emitted "$EMITTED_LEDGER" --persisted "$TRANSCRIPT_LEDGER"
```

## Expected result
Exit code `0` and JSON summary with zero missing, unexpected-content, and duplicate-ID errors.

## Failure behavior
Flush once and rerun. If the second run fails, preserve both ledgers, block verified completion, and escalate the exact event IDs.

## Blocking
Yes. Failure blocks the `Verified` state, though the host may still expose an explicit `completed-but-unverified` state.