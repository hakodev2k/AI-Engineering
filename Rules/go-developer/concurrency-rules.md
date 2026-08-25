# Concurrency Rules

## Purpose
Prevent races, leaks, deadlocks, and unbounded concurrency.

## Scope
Goroutines, channels, mutexes, atomics, worker pools, and shared state.

## MUST
- Every goroutine MUST have a defined owner and termination condition.
- Shared mutable state MUST have an explicit synchronization strategy.
- Concurrency limits MUST be bounded when workload or downstream capacity is finite.
- Channel ownership and closure responsibility MUST be unambiguous.
- Concurrent code MUST pass race detection where applicable.

## MUST NOT
- MUST NOT launch fire-and-forget goroutines without lifecycle and failure handling.
- MUST NOT close channels from arbitrary receivers.
- MUST NOT hold locks across uncontrolled blocking I/O unless justified.
- MUST NOT assume map or composite operations are race-safe.

## SHOULD
- Prefer ownership transfer/message passing when it simplifies invariants.
- Keep critical sections small and measurable.

## Exceptions
Locking or concurrency deviations require contention/deadlock analysis and tests.

## Verification
Run `go test -race`, stress tests, goroutine leak checks, profiles, and review shutdown/error paths.