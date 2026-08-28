# Hook: Cache Regression Check
## Trigger
Before release of an inference-engine, cache, tokenizer, model-adapter, or context-management change.
## Preconditions
A JSONL trace exists for controlled cold/repeat/growing-prefix workloads.
## Action
Run:
`python scripts/prefix_cache_profiler.py <trace.jsonl> --thresholds config/thresholds.json`
## Expected result
Exit `0` only when cache/TTFT thresholds pass and every sample reports output equivalence.
## Failure behavior
Block performance sign-off; retain safe recomputation path and benchmark evidence.
## Blocking
Yes for cache-performance acceptance.
