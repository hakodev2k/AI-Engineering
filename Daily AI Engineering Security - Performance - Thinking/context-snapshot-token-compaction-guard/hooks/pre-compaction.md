# Hook: Pre Compaction

## Trigger
Immediately before automatic context compaction.

## Preconditions
A compaction event contains context-window size, snapshot token count, snapshot provenance and critical-state keys.

## Action
Run `python scripts/compaction_guard.py event.json`.

## Expected result
Exit 0 with `decision: allow_compaction` only when a valid snapshot meets threshold and passes sanity checks.

## Failure behavior
Exit 3 blocks automatic compaction. Exit 2 indicates malformed input and also blocks completion of the compaction step.

## Blocking
Yes.
