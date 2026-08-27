# Hook: Post Trace Benchmark

## Trigger
After a representative benchmark run following any prompt/tool/cache optimization.

## Preconditions
Comparable `before.jsonl` and `after.jsonl` traces and `config/thresholds.json` exist.

## Action
Run:
`python scripts/cache_prefix_profiler.py --before before.jsonl --after after.jsonl --thresholds config/thresholds.json`

## Expected result
Exit 0 only when static replay improves and cache, latency and quality thresholds pass.

## Failure behavior
Non-zero blocks the optimization from being marked verified. Preserve both traces and profiler output for diagnosis.

## Blocking
Yes.
