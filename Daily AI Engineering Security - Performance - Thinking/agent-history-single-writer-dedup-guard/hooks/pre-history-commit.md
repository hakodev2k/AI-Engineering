# Hook: Pre-History Commit

## Trigger
Before release/integration of a changed history persistence path, and optionally as a CI check over captured persistence traces.

## Preconditions
Trace contains configured writers plus append events with stable `message_ids`; message bodies are unnecessary.

## Action
```bash
python scripts/history_write_guard.py "$HISTORY_TRACE"
```

## Expected result
Exit `0`, `active_append_writers=1`, `duplicate_commits=0`, `append_amplification=1.0`.

## Failure behavior
Exit `2`: block completion and surface writer/duplicate IDs. Exit `1`: block because evidence is invalid or unreadable. Never auto-delete persisted history.

## Blocks completion
Yes for a history-persistence change that claims deduplication or token savings.