# Hook — Context Carry Regression

## Trigger
Before merging/releasing changes to tool adapters, agent history management, compaction, context editing or programmatic tool execution.

## Preconditions
Representative JSONL trace and reviewed budget configuration exist; task-quality checks are available.

## Action
Profile the trace and execute unit/quality tests.

## Script / command
```bash
python3 scripts/carry_cost_profiler.py evidence/release-trace.jsonl --config config/budget.json --report evidence/carry-report.json
python3 -m pytest -q tests/test_carry_cost_profiler.py
```

The host must additionally run its task-quality regression suite after any context-removal change.

## Expected result
Profiler exits 0, unit tests pass, and the host quality suite is equal or better than baseline.

## Failure behavior
Exit code 2 blocks completion for a budget regression; exit code 3 blocks completion for invalid evidence/configuration. Any correctness/security regression blocks completion even when token budgets pass.

## Blocks completion
Yes.

## Safety constraint
Do not make this hook pass by deleting required context, excluding child calls from accounting, disabling security checks, or silently raising thresholds.