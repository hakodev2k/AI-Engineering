# Hook: Post Session Cache Check
## Trigger
After a large-context agent session or benchmark run.
## Preconditions
A JSONL trace exists with input, cache read/write token counts, and latency per request.
## Action
Run `python scripts/cache_collapse_profiler.py --trace <trace.jsonl> --config config/thresholds.json`.
## Expected result
Exit 0 means no sustained collapse detected; exit 3 means a measured collapse episode requires investigation; exit 2 means telemetry is invalid.
## Failure behavior
Do not optimize blindly. Preserve the trace, classify the failure, and block any claim of improvement until valid measurements exist.
## Blocks completion
Yes for performance/token optimization claims; no for unrelated task completion unless the session budget is itself a required acceptance criterion.
