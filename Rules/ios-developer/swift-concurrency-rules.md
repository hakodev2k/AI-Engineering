# Swift Concurrency Rules

## Purpose
Prevent data races, deadlocks, priority inversions, cancellation bugs, and UI isolation violations.

## Scope
async/await, actors, tasks, continuations, callbacks, and shared mutable state.

## MUST
- UI state mutations MUST execute on MainActor or an equivalent explicitly isolated boundary.
- Shared mutable state MUST have a documented isolation strategy.
- Cancellation MUST be propagated and observed for operations whose result is no longer useful.
- Continuations MUST resume exactly once on every reachable path.
- Task lifetime and ownership MUST be explicit for work that can outlive the initiating scope.

## MUST NOT
- MUST NOT block cooperative executor threads with synchronous waits or long CPU-bound work.
- MUST NOT use detached tasks to bypass actor isolation or structured concurrency.
- MUST NOT mark types Sendable unsafely without evidence that their invariants are thread-safe.
- MUST NOT ignore cancellation for expensive network, disk, or compute work without justification.

## SHOULD
- Prefer structured task groups and actor isolation over ad hoc locking.
- Keep actor critical sections small and avoid unnecessary cross-actor chatter.
- Test cancellation, ordering, and concurrent access explicitly.

## Exceptions
Unsafe concurrency annotations or unstructured tasks require documented necessity, risk analysis, containment, and senior review.

## Verification
Enable strict concurrency checking, inspect compiler diagnostics, run Thread Sanitizer where applicable, stress concurrent paths, and review task ownership and cancellation behavior.