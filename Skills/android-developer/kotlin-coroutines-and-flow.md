# Kotlin Coroutines and Flow

## Purpose
Build cancellation-safe, lifecycle-aware, structured asynchronous Android code using coroutines and Flow without leaks, races, or hidden blocking.

## When to use
Use for concurrent work, reactive streams, repository APIs, UI state, or background operations. Do not use coroutines to hide blocking APIs without moving them to an appropriate dispatcher.

## Inputs
Call graph, coroutine scopes, dispatcher usage, Flow producers/collectors, retry rules, lifecycle requirements, thread-safety constraints.

## Preconditions
Identify ownership and lifetime of every launched task.

## Context to inspect
ViewModel scopes, lifecycle scopes, suspend functions, callbacks, channels, StateFlow/SharedFlow, dispatchers, exception handlers, mutexes, and blocking libraries.

## Core knowledge
Structured concurrency ties child work to an owner. Cancellation is cooperative. Flow is cold unless shared. StateFlow models current state; SharedFlow models broadcasts. Dispatcher choice does not replace synchronization.

## Procedure
1. Trace every asynchronous entry point and owner.
2. Replace unscoped launches with structured scopes.
3. Mark blocking boundaries and move them off constrained threads.
4. Define cancellation behavior for network, disk, and CPU work.
5. Choose StateFlow, SharedFlow, channel, or suspend result by semantics.
6. Make retries bounded and classify retryable failures.
7. Prevent duplicate collectors and duplicate side effects.
8. Protect shared mutable state or redesign to avoid it.
9. Test cancellation, timeout, exception propagation, and rapid re-entry.
10. Inspect traces when dispatcher starvation or latency is suspected.

## Decision points
Use parallelism only when work is independent and resource budgets allow it. Prefer supervisor semantics only when sibling failure should not cancel peers.

## Common failure patterns
GlobalScope, swallowed CancellationException, blocking Main, unbounded retry, nested collectors, unnecessary flowOn, races around mutable caches, and fire-and-forget jobs.

## Verification
Verify with coroutine tests, cancellation tests, strict-mode/profiling evidence, and lifecycle scenarios. Implemented asynchronous code is verified only when failure and cancellation paths are exercised.

## Expected output
Explicit scope ownership, dispatcher policy, stream semantics, error/cancellation behavior, and passing concurrency tests.

## Stop conditions
Escalate when third-party APIs cannot be cancelled safely, shared-state ownership is unclear, or correctness depends on undocumented threading behavior.