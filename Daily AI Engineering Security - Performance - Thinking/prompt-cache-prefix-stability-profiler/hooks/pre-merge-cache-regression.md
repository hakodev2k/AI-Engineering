# Hook: Pre-Merge Cache Regression Check

## Trigger
Changes to prompts, tool schemas, tool ordering, system instructions, static context builders, or model/request settings.

## Preconditions
A baseline request snapshot and candidate snapshot from the same task family exist.

## Action
Run the prefix profiler, then compare provider usage/quality metrics against `config/profile.json` thresholds.

## Command
`python3 scripts/prefix_profiler.py baseline.json candidate.json --config config/profile.json`

## Expected result
Exit `0` when cache-intended prefix remains stable. Exit `3` is a detected structural divergence requiring explanation and benchmark evidence; exit `2` is invalid input/config.

## Failure behavior
A divergence is not automatically forbidden, but it blocks completion until its necessity is documented and before/after cache/token/quality metrics satisfy policy. Invalid evidence always blocks.

## Blocking
Yes for unexplained divergence, quality regression, or uncached-token regression beyond policy.
