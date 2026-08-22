# Hook: Cache Regression Check

## Trigger
After a prompt/context-builder/tool-catalog change and before production rollout.

## Preconditions
A baseline trace file and candidate trace file exist for equivalent representative tasks. Both are sanitized and include ordered segments plus token/cache telemetry when available.

## Action
Run the analyzer on baseline and candidate, compare the generated summaries, and block when stable-prefix or token metrics regress beyond policy without an approved correctness-driven reason.

## Script/command
```bash
python scripts/cache_prefix_analyzer.py candidate-traces.json --policy config/cache-policy.json --baseline baseline-traces.json
```

## Expected result
Exit `0` with `allow` when candidate metrics satisfy policy and no quality regression is declared. Exit `4` for review-required/missing cache telemetry. Exit `5` for measurable regression. Exit `2` for invalid input.

## Failure behavior
Do not promote the cache-layout change. Keep the previous verified context assembly, record the exact regressed metric or unavailable telemetry, and hand off to the bounded optimization workflow.

## Blocking
Yes for exit `5` or `2`. Exit `4` blocks automatic completion and requires explicit review/evidence.