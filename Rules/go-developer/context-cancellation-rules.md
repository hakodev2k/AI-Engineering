# Context and Cancellation Rules

## Purpose
Ensure request lifetimes, deadlines, and cancellation propagate correctly.

## Scope
`context.Context`, I/O, RPC, database work, goroutines, and background operations.

## MUST
- Request-scoped operations MUST propagate the caller context through blocking boundaries.
- Long-running work MUST observe cancellation where termination is meaningful.
- External calls MUST have bounded deadlines or inherit a bounded caller deadline.
- Context values MUST be limited to request-scoped metadata crossing API boundaries.

## MUST NOT
- MUST NOT store contexts in structs as a general dependency mechanism.
- MUST NOT replace a canceled context with `context.Background()` to keep request work alive silently.
- MUST NOT use context values for ordinary required function parameters.

## SHOULD
- APIs SHOULD accept context as the first parameter when cancellation is supported.
- Cleanup SHOULD distinguish cancellation from independent operational failure when useful.

## Exceptions
Detached work requires explicit ownership, lifecycle, durability, and shutdown behavior.

## Verification
Use cancellation/deadline tests, goroutine leak checks, integration tests with slow dependencies, and code review of context propagation.