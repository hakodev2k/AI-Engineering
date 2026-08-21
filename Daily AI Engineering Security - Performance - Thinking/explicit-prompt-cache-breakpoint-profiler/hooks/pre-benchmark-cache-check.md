# Hook: Pre-Benchmark Cache Check

## Trigger
Before any prompt-cache optimization benchmark or before declaring a cache regression.

## Preconditions
Provider/model/adapter are known and at least the configured minimum number of comparable request manifests can be captured.

## Action
1. Validate that each manifest contains ordered `blocks` and usage metadata when available.
2. Remove or hash sensitive values before persistence.
3. Execute `python scripts/cache_prefix_profiler.py manifests.json --policy config/policy.json`.
4. Block optimization claims when comparable-request count or usage observability is insufficient.

## Expected result
Exit 0 with a report containing common stable-prefix length, first-divergence positions, block-change frequencies, and measured cache ratios when supplied. Exit 2 means invalid input; exit 3 means insufficient evidence.

## Failure behavior
Do not guess a breakpoint or cache improvement. Record the observability gap and collect additional comparable requests or provider usage data.

## Blocks completion
Yes for any claim labeled Measured or Verified.
