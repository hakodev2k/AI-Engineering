# Hook: Post-Compaction Check

## Trigger
After compaction and after the configured observation turns.

## Preconditions
Trace contains the active context window, source token counts, cache-read tokens, and input tokens.

## Action
Run `python scripts/refill_guard.py --trace <trace.jsonl> --budget config/budget.json`.

## Expected result
Exit 0 with `status=pass`.

## Failure behavior
Exit 3 blocks optimization completion and reports failing budget dimensions. Exit 2 blocks on invalid trace or configuration.

## Blocking
Yes.
