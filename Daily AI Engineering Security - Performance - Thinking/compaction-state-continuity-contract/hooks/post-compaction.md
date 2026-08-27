# Hook: Post Compaction Continuity Gate

## Trigger
After replacement context is constructed and durable state is rehydrated, but before the first subsequent model or tool step.

## Preconditions
`before.json`, `after.json`, checkpoint JSON, and token budget policy are available. `after.json` represents a new context epoch.

## Action
Run:

```bash
python scripts/checkpoint_guard.py \
  --before <before.json> \
  --after <after.json> \
  --checkpoint <checkpoint.json> \
  --policy config/budget.json
```

## Expected result
Exit `0` with `status=pass`, no missing/changed durable context, a rotated epoch, and all token metrics within policy.

## Failure behavior
Exit `2` blocks continuation because validation could not be performed. Exit `3` blocks continuation because continuity or token-budget requirements failed. Preserve reason codes and rebuild at most once before fallback/escalation.

## Blocking
Yes. The next model/tool step MUST NOT run after hook failure.
