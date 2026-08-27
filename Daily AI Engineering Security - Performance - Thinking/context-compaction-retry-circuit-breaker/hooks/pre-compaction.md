# Hook: Pre-Compaction Gate

## Trigger
Immediately before an automatic compaction retry.

## Preconditions
A complete state JSON and policy JSON exist; source history is preserved.

## Action
Run:
`python scripts/compaction_guard.py --state <state.json> --policy config/policy.json`

## Script/command
The hook executes only the deterministic guard and does not mutate conversation history.

## Expected result
Exit 0 means one retry is permitted. Exit 3 means automatic retry must stop. Exit 2 means invalid input.

## Failure behavior
Any non-zero result blocks automatic retry, preserves the original context, records reason codes, and routes to bounded fallback.

## Blocking
Yes.
