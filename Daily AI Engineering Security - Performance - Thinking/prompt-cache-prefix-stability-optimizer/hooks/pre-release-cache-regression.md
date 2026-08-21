# Hook: Pre-release Cache Regression

## Trigger
Before releasing a prompt/tool/schema layout change that affects a cacheable agent workflow.

## Preconditions
A baseline JSONL cohort and candidate JSONL cohort exist; quality evidence is populated; thresholds are configured.

## Action
Run:

`python scripts/cache_profiler.py baseline.jsonl --thresholds config/thresholds.json --candidate candidate.jsonl --strict`

## Expected result
Exit 0 and a comparison report showing acceptable candidate cache reuse and quality/latency regression.

## Failure behavior
Exit 2 blocks because input/config is invalid. Exit 3 blocks because thresholds or quality gates fail. Store only sanitized metrics/hashes.

## Blocks completion
Yes when `require_quality_evidence` is true or a configured regression threshold fails.