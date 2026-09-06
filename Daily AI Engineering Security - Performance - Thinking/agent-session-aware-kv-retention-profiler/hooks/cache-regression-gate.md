# Hook: Cache Regression Gate

## Trigger
After candidate benchmark and before rollout.

## Preconditions
Baseline and candidate JSONL traces are from comparable workload classes and contain required fields.

## Action
Generate a comparison and enforce configured p95 TTFT regression threshold.

## Script/command
`python scripts/profile_cache.py candidate.jsonl --baseline baseline.jsonl --max-p95-regression-pct 5 --out comparison.json`

## Expected result
Exit 0; comparison reports non-regressing p95 TTFT and exposes reuse/resume deltas for reviewer acceptance.

## Failure behavior
Non-zero exit blocks rollout. Revert candidate or run one remaining evidence-backed hypothesis under the bounded workflow.

## Blocks completion
Yes.
