# Hook: Post-Benchmark Cache Budget Gate

## Trigger
After a representative GPT-5.6 agent benchmark or staging workload has produced request telemetry.

## Preconditions
Trace rows contain workload ID, input tokens, cached tokens, cache-write tokens, prompt cache key, and stable-prefix fingerprint. Sensitive prompt text is not required.

## Action
Run:
`python scripts/cache_write_guard.py --trace <requests.jsonl> --policy config/policy.json`

## Expected result
Exit code `0`; each measured workload is within configured cache-write/read and zero-read thresholds.

## Failure behavior
Exit code `3` blocks an optimization-success claim and requires diagnosis. Exit code `2` blocks completion because telemetry could not be evaluated.

## Blocking
Yes for declaring the cache optimization verified. Insufficient-evidence groups require more measurement rather than fabricated conclusions.
