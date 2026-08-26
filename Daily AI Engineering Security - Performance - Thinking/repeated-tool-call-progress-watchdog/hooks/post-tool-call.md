# Hook: Post Tool Call
## Trigger
Immediately after every autonomous tool result.
## Preconditions
Tool name, normalized arguments, token count, and an externally verifiable progress flag are available.
## Action
Append one JSONL trace row and run `python scripts/progress_watchdog.py --trace <trace.jsonl> --config config/watchdog.json`.
## Expected result
Exit 0 permits continuation; exit 3 blocks continuation because the recovery budget is exhausted; exit 2 blocks on invalid evidence.
## Failure behavior
Fail closed and preserve the non-secret trace.
## Blocks completion
Yes when exit code is non-zero.
