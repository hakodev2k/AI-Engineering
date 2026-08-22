# Concurrency and Threading Rules
## Purpose
Prevent races, UI freezes, deadlocks, and corrupted state.
## Scope
Async work, threads, actors/tasks, synchronization, cancellation, and UI dispatch.
## MUST
- Shared mutable state MUST have an explicit synchronization or ownership model.
- Blocking I/O and expensive computation MUST stay off the UI thread.
- Cancellation MUST propagate through operations whose result is no longer needed.
## MUST NOT
- Fire-and-forget work MUST NOT hide failures that affect correctness.
- UI objects MUST NOT be mutated from unsupported threads.
## SHOULD
- Prefer structured concurrency and immutable message passing over ad hoc shared-state locking.
## Exceptions
Fire-and-forget telemetry may be allowed when bounded, failure-tolerant, and lifecycle-safe.
## Verification
Use concurrency tests, thread diagnostics, race detection where available, cancellation tests, and UI responsiveness profiling.