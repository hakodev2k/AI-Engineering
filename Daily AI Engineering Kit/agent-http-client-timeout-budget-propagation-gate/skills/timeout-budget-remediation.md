# Timeout Budget Remediation

## Purpose
Apply the smallest safe change that guarantees downstream work cannot outlive the caller's remaining deadline.

## Inputs
Investigation findings, target SLA, current retry policy, affected files and tests.

## Process
1. Preserve the public SLA unless an explicit requirement changes it.
2. Derive a deadline once at the request boundary.
3. Pass cancellation/deadline context through every internal layer.
4. Before each downstream call, calculate remaining budget minus `network_reserve_ms`.
5. Skip or fail fast if the result is below `minimum_downstream_budget_ms`.
6. Cap child timeout to the smaller of its configured timeout and remaining budget.
7. Allow at most `max_retries`; retry only transient failures and only when enough budget remains for another attempt.
8. Preserve the original cancellation reason and timeout evidence.
9. Add tests covering parent cancellation, child timeout capping, retry suppression, and near-expired deadlines.
10. Run focused tests, then the package gate, then inspect the diff.

## Constraints
Do not increase timeout budgets to hide latency without evidence. Do not remove cancellation. Do not change production resilience settings without required approval.

## Verification
The request completes, fails, or cancels within the parent budget plus documented scheduler/network tolerance. Tests prove child calls cannot exceed the remaining budget.

## Failure handling
After two implementation/test cycles, stop, preserve logs and diffs, and escalate unresolved failures.
