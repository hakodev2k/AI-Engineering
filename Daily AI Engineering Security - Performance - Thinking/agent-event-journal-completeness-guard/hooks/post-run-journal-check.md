# Hook: Post-Run Journal Check

## Trigger
Immediately before a host changes a run from Implemented/Measured to Verified, and before resume after abnormal termination.

## Preconditions
Canonical journal is closed for writing; optional mirror has been flushed and made read-only for the audit window.

## Action
Without mirror: `python3 scripts/audit_event_journal.py <journal.jsonl> --output <audit.json>`.

With authoritative mirror: `python3 scripts/audit_event_journal.py <journal.jsonl> --mirror <mirror.jsonl> --output <audit.json>`.

## Expected result
Exit 0 and `pass: true`.

## Failure behavior
Exit 2 blocks Verified/resume and starts `workflows/audit-and-recover.md`. Exit 1 indicates malformed/unreadable evidence and also blocks completion until corrected without changing source evidence.

## Blocks completion
Yes.
