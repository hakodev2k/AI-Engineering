# Hook: Post-run Cache Affinity Check

## Trigger
After a representative multi-turn OpenRouter agent run in CI, staging, canary or benchmark execution.

## Preconditions
Sanitized JSONL trace contains one row per model call with `session_id`, `prefix_hash`, `provider`, `input_tokens` and `cached_tokens`.

## Action
Run:
`python scripts/cache_affinity_profiler.py --trace <trace.jsonl> --thresholds config/thresholds.json`

When a baseline exists, add:
`--baseline <baseline.jsonl>`

## Expected result
Exit 0, stable session/prefix identity, acceptable cache-hit/cached-token metrics, and no unexplained excessive cold streak.

## Failure behavior
Block the optimization/release gate, retain sanitized metrics, and route to `workflows/measure-optimize.md`. Do not weaken context or thresholds merely to make the check pass.

## Blocks completion
Yes for cache-affinity changes once `min_calls_for_enforcement` is reached; insufficient-call warnings require a larger representative run rather than a success claim.
