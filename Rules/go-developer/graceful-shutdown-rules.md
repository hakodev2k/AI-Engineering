# Graceful Shutdown Rules

## Purpose
Ensure Go processes terminate predictably without corrupting work or hanging indefinitely.

## Scope
Signals, servers, workers, queues, goroutines, connections, and process lifecycle.

## MUST
- Services MUST define startup, readiness, shutdown, and termination behavior.
- Shutdown MUST stop accepting new work before draining bounded in-flight work when required.
- Cleanup MUST have a finite deadline.
- Background workers MUST receive cancellation and expose completion/failure.
- Durable work MUST have a defined retry or handoff strategy if shutdown interrupts it.

## MUST NOT
- MUST NOT wait indefinitely for untrusted dependencies during shutdown.
- MUST NOT abandon acknowledged durable work without a recovery strategy.
- MUST NOT call abrupt process termination from arbitrary library code.

## SHOULD
- Exercise signal-driven shutdown in integration tests.
- Order dependency teardown to preserve invariants.

## Exceptions
Immediate termination is allowed for conditions where continued execution is unsafe; document recovery consequences.

## Verification
Signal tests, shutdown deadline tests, worker-drain tests, goroutine leak checks, and deployment termination observations.