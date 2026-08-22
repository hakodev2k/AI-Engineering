# Hook — Preflight Cache Regression

## Trigger
Before merging or deploying a change that affects prompt assembly, tool registration, memory/context injection, compaction, provider middleware, or cache configuration.

## Preconditions
- Candidate request-component manifest exists.
- Known-good baseline manifest/report exists for regression mode.
- `config/cache-policy.json` is available.

## Action
Run:

```bash
python scripts/cache_prefix_guard.py current.json --baseline baseline.json --policy config/cache-policy.json
```

For first-time baseline creation:

```bash
python scripts/cache_prefix_guard.py current.json --policy config/cache-policy.json
```

## Expected result
Exit `0` means deterministic policy checks pass. Exit `3` means a cache-prefix regression was detected. Exit `2` means invalid input/configuration.

## Failure behavior
Regression or invalid input blocks completion. Do not automatically remove context or relax security/system instructions. Produce the JSON report for diagnosis.

## Blocks completion
Yes for unexpected stable-prefix churn, tool-schema growth over threshold, volatile-before-stable violations, or malformed manifests.
