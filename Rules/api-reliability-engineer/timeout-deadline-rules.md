# Timeout and Deadline Rules

## Purpose
Bound request work so slow dependencies cannot consume resources indefinitely or violate caller expectations.

## Scope
Applies to synchronous and asynchronous API calls, downstream dependencies, queues, and long-running operations.

## MUST
- Every remote call MUST have an explicit finite timeout or inherited deadline appropriate to its latency budget.
- End-to-end deadlines MUST be propagated where supported so downstream work cannot outlive the caller's useful window.
- Timeout values MUST be derived from latency budgets, dependency behavior, and recovery strategy rather than copied defaults.
- Timeout failures MUST be observable separately from other failures.
- Cancellation MUST release avoidable resources and stop unnecessary downstream work.

## MUST NOT
- MUST NOT configure nested timeouts whose combined worst-case duration exceeds the caller deadline without explicit justification.
- MUST NOT use infinite network timeouts for production request paths.
- MUST NOT automatically retry a timed-out non-idempotent operation unless duplicate effects are prevented.

## SHOULD
- Connection, read, write, queue, and total request timeouts SHOULD be distinguished where the stack supports them.
- Deadline headroom SHOULD account for response serialization and upstream recovery.

## Exceptions
Exceptions require measured dependency behavior, bounded risk, alternative controls, owner, review date, and approval for production-critical paths.

## Verification
Inspect client/server configuration, deadline propagation, traces, timeout metrics, cancellation tests, load tests, and fault-injection results.