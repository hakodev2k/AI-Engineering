# Hook: Pre-Turn Session Budget Check

## Trigger
Before a long-lived session's persisted history is reconstructed into the next model request, or before accepting a runtime change that alters replay behavior.

## Preconditions
A session JSONL snapshot and `config/budget.json` are available. The hook operates on a copy/read-only source.

## Action
Run:

```bash
python scripts/session_bloat_profiler.py session.jsonl --policy config/budget.json --json-out session-profile.json
```

## Expected result
Exit code `0` and a valid profile report whose metadata/duplicate pressure remains below blocking thresholds. Warnings should be recorded for review even when they do not block.

## Failure behavior
- Exit `2`: malformed session/config; block verification because measurements are unreliable.
- Exit `3`: configured metadata budget or exact-duplicate ratio is exceeded; block acceptance of the current replay policy until analyzed.

The hook does not delete session records and does not automatically discard protected or unknown event classes.

## Blocking
Yes for exit `2` or `3` when used as a regression/acceptance gate. Runtime owners may choose an operational warning mode in production, but verification of an optimization cannot claim success while the blocking condition remains unresolved.
