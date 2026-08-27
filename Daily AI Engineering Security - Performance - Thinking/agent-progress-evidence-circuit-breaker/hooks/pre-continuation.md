# Hook: Pre Continuation

## Trigger
Immediately before an automatic agent continuation or recovery step is scheduled.

## Preconditions
Authoritative task state is freshly read and recent events have been appended to the JSONL ledger.

## Action
Run:

```bash
python scripts/progress_guard.py --events <run-events.jsonl> --policy config/policy.json
```

## Expected result
Exit `0` with `decision=continue` only when no terminal state or bounded-loop threshold blocks the next step.

## Failure behavior
Exit `2` means malformed input or guard failure and MUST fail closed. Exit `3` means stop scheduling and preserve reason codes for review.

## Blocking
Yes. Hook failure blocks continuation.
