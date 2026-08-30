# Hook: Premerge Performance Gate

## Trigger
Before merging a material agent orchestration, retry, tool, retrieval, sandbox, cache, or serving change.

## Preconditions
Baseline and candidate traces use the same representative workload and quality criteria.

## Action
Generate candidate report, compare to baseline, and run deterministic tests.

## Script / command
```bash
python scripts/agent_trace_profiler.py candidate.jsonl --compare baseline-report.json --json-out candidate-report.json
python -m unittest tests/test_agent_trace_profiler.py
```

## Expected result
Exit code 0; no configured regression; quality floor preserved; profiler tests pass.

## Failure behavior
Block merge. Preserve reports and identify whether failure is measurement, performance, quality, or safety related.

## Blocking
Yes for configured regression thresholds, quality regression, or missing baseline.
