# Skill: Background Work Accounting

## Purpose
Measure and bound model activity performed outside the active foreground turn.

## Trigger
Use when a runtime launches memory, review, summarization, synchronization, delegated, scheduled, or other auxiliary AI work.

## Inputs
Normalized event stream, declared budgets, parent task identity, expected outputs.

## Preconditions
Event timestamps are UTC or offset-aware; job/parent identities are stable; token fields are numeric and non-negative.

## Required context
Why the job exists, what constitutes progress, which events represent external input, and the maximum acceptable spend/time.

## Allowed tools
Read-only trace/log access; `scripts/background_budget_guard.py`; test runner; runtime cancellation API only after a violation and according to host policy.

## Constraints
Do not infer hidden reasoning. Do not count network/model success as useful progress. Do not redact or compress correctness-critical context merely to pass a budget.

## Procedure
1. Define a foreground baseline for comparable tasks: requests, tokens, duration, and successful output rate.
2. Enumerate background job classes and assign stable identities.
3. Set soft and hard request/token/wall-time budgets based on baseline and expected utility.
4. Emit normalized events before/after model requests and when progress state changes.
5. Run the guard over a representative trace.
6. Investigate unattributed events, repeated state fingerprints, and idle requests.
7. Change one orchestration mechanism at a time: dispatch threshold, progress gate, retry bound, or budget.
8. Re-run the same workload and compare metrics.
9. Independently verify that useful outputs and foreground task quality do not regress.

## Decision points
- Unattributed request: block verification and fix instrumentation.
- Hard budget exceeded: stop the job; do not silently enlarge the budget.
- Three unchanged progress turns: stop and diagnose.
- Spend reduced but useful-output rate drops: reject the optimization.

## Expected output
A per-job budget report with totals, violations, repeated-state evidence, and before/after comparison.

## Metrics
Requests/job, tokens/job, cached-input ratio, idle requests/hour, no-progress turns, useful outputs/request, unattributed percentage.

## Verification
A workload is Verified when all requests are attributable, no hard budget is crossed, no loop exceeds the no-progress limit, and quality is no worse than the declared tolerance.

## Failure handling
Capture the offending event range, stop only the affected job when possible, retain evidence, and escalate if attribution is ambiguous.

## Stop conditions
Stop analysis after the trace is fully reconciled or after one blocking instrumentation gap prevents reliable accounting. Optimization retries are limited to 3 iterations.
