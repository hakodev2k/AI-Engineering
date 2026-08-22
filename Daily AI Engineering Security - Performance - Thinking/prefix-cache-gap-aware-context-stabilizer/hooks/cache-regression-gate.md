# Hook — Cache Regression Gate

## Trigger
After candidate telemetry and task-quality fixtures are produced.

## Preconditions
Baseline and candidate datasets represent the same workload shape and use the same provider/model/cache mode.

## Action
1. Run the analyzer on baseline and candidate telemetry.
2. Compare uncached input tokens and p95 TTFT when present.
3. Require the existing task-quality regression suite to pass.
4. Block completion when configured regression thresholds are exceeded.

## Script / command
```bash
python3 scripts/analyze_prefix_cache.py baseline.jsonl --policy config/policy.json > baseline-report.json
python3 scripts/analyze_prefix_cache.py candidate.jsonl --policy config/policy.json > candidate-report.json
# Then run the repository's existing quality/eval command.
```

## Expected result
Candidate has no configured regression and task-quality fixtures pass.

## Failure behavior
Mark the optimization Measured but not Verified. Revert or re-diagnose; do not weaken context or policy to make the gate pass.

## Blocking
Yes. Failure blocks Verified status and completion.
