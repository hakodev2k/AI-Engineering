# Error and Recovery Rules

## Purpose
Make kernel failures bounded, diagnosable, and recoverable without corrupting state.

## Scope
Error propagation, cleanup, partial initialization, hardware failures, retry, reset, and degraded operation.

## MUST
- Error paths MUST preserve the original failure signal unless intentionally translated with documented semantics.
- Partial initialization MUST unwind resources in reverse dependency order or an equivalently safe sequence.
- Recovery logic MUST define which state remains valid and which state is rebuilt.
- Retries MUST be bounded and distinguish transient from persistent failures.
- Critical recovery paths MUST be testable without requiring an actual production outage.

## MUST NOT
- MUST NOT silently swallow unexpected failures.
- MUST NOT continue using state whose validity is unknown after an error.
- MUST NOT retry indefinitely or at an unbounded rate.
- MUST NOT replace a specific diagnostic failure with an unrelated generic success/failure state.

## SHOULD
- Recovery SHOULD be idempotent when repeated invocation is possible.
- Errors SHOULD retain enough context to identify subsystem, operation, and relevant state.
- Degraded modes SHOULD expose their operational limitations.

## Exceptions
Exceptions require failure-mode analysis, bounded impact, diagnostic strategy, and maintainer approval for critical paths.

## Verification
Use fault injection, allocation failures, device timeouts, malformed inputs, repeated recovery, teardown-after-failure tests, and review cleanup coverage.