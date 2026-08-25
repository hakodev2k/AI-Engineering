# Hook: Progress Watchdog

## Trigger
After each normalized model/agent stream event and on a host timer no more frequent than every 15 seconds.

## Preconditions
Append-only event ledger for the active turn; UTC/offset-aware timestamps.

## Action
Append only `ts`, `kind`, optional cumulative tokens, optional `visible_progress`. Periodically invoke:
```bash
python scripts/stall_watchdog.py "$TRACE" --silent-seconds "$SILENT_SECONDS" --token-delta "$TOKEN_DELTA"
```

## Expected result
Exit 0 healthy/terminal; 10 progress-silent token burn; 11 event-stream stall; 12 invalid evidence.

## Failure behavior
Exit 12 blocks automated recovery. Exit 10/11 may request host cancellation only after checking whether a mutating tool could still be active.

## Blocks completion
Yes for invalid evidence or unresolved stall. No performance improvement may be declared without before/after measurement.
