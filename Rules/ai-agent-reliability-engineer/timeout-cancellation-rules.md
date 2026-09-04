# Timeout and Cancellation Rules

## Purpose
Ensure agent operations terminate predictably and propagate cancellation without leaving uncontrolled work behind.

## Scope
Applies to model calls, tool calls, workflows, sub-agents, network operations, and background execution.

## MUST
- Every external operation MUST have a bounded timeout appropriate to expected service behavior.
- Cancellation MUST propagate to child operations where the underlying platform supports it.
- Workflows MUST distinguish timeout, cancellation, dependency failure, and business rejection.
- Cleanup or reconciliation MUST run when cancellation can leave partial state.
- Timeout budgets MUST be coordinated across nested calls so children cannot outlive the parent budget unintentionally.

## MUST NOT
- Infinite waits MUST NOT be used in production workflows.
- Cancellation MUST NOT be reported as successful completion.
- A parent run MUST NOT terminate while known child side effects continue unmanaged.

## SHOULD
- Long operations SHOULD expose progress or heartbeats when useful for detecting stalls.
- Timeouts SHOULD be informed by observed latency distributions rather than arbitrary constants.

## Exceptions
Longer or unbounded operations require explicit architectural justification, watchdog controls, and owner approval.

## Verification
Run timeout injection tests, cancellation propagation tests, partial-state recovery tests, and inspect traces for orphaned operations.