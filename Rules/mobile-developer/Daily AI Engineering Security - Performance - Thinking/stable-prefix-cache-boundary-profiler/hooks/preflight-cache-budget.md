# Hook: Preflight Cache Budget

## Trigger
Before accepting a prompt-layout, cache-key, compaction, resume, or explicit-breakpoint change.

## Preconditions
`config/cache-policy.json` exists and representative trace JSONL has at least the configured minimum samples.

## Action
Run the deterministic profiler and block completion when sample count, quality, or policy requirements fail.

## Script/command
`python scripts/cache_prefix_profiler.py <trace.jsonl> --policy config/cache-policy.json --strict`

## Expected result
Exit code 0 and a JSON report showing sufficient samples, no required quality failure, and cache metrics that satisfy configured thresholds when those metrics are present.

## Failure behavior
Exit code 2 means invalid inputs/configuration. Exit code 3 means policy violation. Preserve the report and return the change to diagnosis; do not lower thresholds merely to pass.

## Blocks completion
Yes.
