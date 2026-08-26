# Hook: Post-Step Convergence Gate

## Trigger
After each tool/model step is recorded in the run trace and before dispatching the next autonomous step.

## Preconditions
The trace contains normalized tool name/arguments and, where possible, a progress key plus completed/open acceptance counts.

## Action
Run:
`python scripts/convergence_guard.py --trace <run.jsonl> --policy config/policy.json`

Interpret exit codes:
- `0`: continue
- `1`: warning; next step must change hypothesis/input/action or move to completion
- `2`: invalid trace/policy; block autonomous continuation until instrumentation is fixed
- `3`: stop autonomous loop and enter bounded failure/completion handling

## Expected result
Productive runs continue; repeat/no-progress/scope-runaway traces are warned or stopped before consuming the entire outer budget.

## Failure behavior
On invalid instrumentation, fail closed for autonomous looping but preserve task artifacts. On stop, do not auto-retry the identical action.

## Blocks completion
A warning does not block completion. Exit 2 or 3 blocks further autonomous steps until verification, clarification, or approved recovery occurs.
