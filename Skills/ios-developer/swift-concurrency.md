# Swift Concurrency

## Purpose
Implement responsive, race-resistant asynchronous iOS code with async/await, tasks, actors, cancellation, isolation, and Sendable boundaries.

## When to use
Use for network/data pipelines, background work, concurrent state, migration from callbacks, or concurrency warnings.

## Inputs
Async requirements, state owners, latency expectations, cancellation semantics, supported Swift version.

## Context to inspect
Actor annotations, Task creation, continuations, shared mutable state, callback APIs, MainActor usage, cancellation propagation, tests.

## Core knowledge
Structured concurrency ties child work to lifetimes. Actor isolation protects mutable state but does not make multi-step business operations atomic. MainActor is for UI-affine state, not arbitrary work.

## Procedure
1. Map asynchronous operations and state ownership.
2. Define actor/isolation boundaries.
3. Prefer async APIs and structured child tasks.
4. Propagate cancellation and errors.
5. Bridge callbacks with checked continuations only when necessary.
6. Keep CPU-heavy work off the main actor.
7. Avoid detached tasks unless lifecycle independence is intentional.
8. Resolve Sendable diagnostics rather than suppressing them blindly.
9. Test cancellation, ordering, and repeated concurrent access.

## Decision points
Use actors for shared mutable state; immutable Sendable values for transfer. Use task groups for bounded parallel work with a common lifetime.

## Common failure patterns
Unstructured Task leaks, MainActor overuse, continuation double-resume, ignored cancellation, actor reentrancy assumptions, and unchecked Sendable escapes.

## Verification
Run strict concurrency diagnostics where supported, tests under repeated execution, cancellation tests, and UI responsiveness checks.

## Expected output
Explicit isolation, bounded task lifetimes, predictable cancellation, and no unexplained concurrency warnings.

## Stop conditions
Stop when a third-party API has undocumented thread guarantees or a data race requires architectural ownership changes.