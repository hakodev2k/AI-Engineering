# Deadline and Cancellation Rules

## Purpose
Bound work, prevent resource leaks, and propagate caller intent through RPC graphs.

## Scope
Client calls, server handlers, downstream RPCs, database calls, and background work initiated by requests.

## MUST
- Production RPCs MUST have a bounded deadline derived from the operation's latency objective.
- Server work MUST observe cancellation where the underlying operation supports it.
- Downstream deadlines MUST not exceed the caller's remaining budget.
- Cleanup MUST occur when calls terminate or cancel.
- Deadline exhaustion MUST be observable.

## MUST NOT
- MUST NOT use infinite deadlines for normal request paths.
- MUST NOT start detached work from an RPC merely to evade cancellation unless that work is intentionally durable and independently owned.
- MUST NOT retry after the caller's remaining deadline cannot accommodate another safe attempt.

## SHOULD
- Allocate latency budgets across dependencies with reserve for serialization and response handling.

## Exceptions
Streaming or administratively controlled operations may use long deadlines when lifecycle, resource limits, and cancellation are explicitly designed.

## Verification
Use cancellation tests, timeout tests, traces showing propagated deadlines, and resource metrics demonstrating cleanup.