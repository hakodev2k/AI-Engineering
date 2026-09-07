# Browser Memory Leak Debugging

## Purpose
Identify and eliminate browser memory leaks and unbounded retention that degrade long-lived sessions, increase GC pressure, or cause crashes.

## When to use
Use when memory grows across repeated interactions, tabs become progressively slower, mobile browsers reload/crash, or heap snapshots show retained detached objects.

## Inputs
Heap snapshots, allocation timelines, browser traces, reproduction steps, component lifecycle code, event/subscription registrations, cache structures.

## Context to inspect
Define a repeatable interaction loop and expected steady-state memory. Inspect detached DOM nodes, closures, listeners, timers, observers, workers, sockets, global stores, caches, and framework teardown semantics.

## Core knowledge
A leak is retained memory that should become unreachable, not merely a large heap. Garbage collection is nondeterministic, so compare post-GC steady states across repeated cycles. Retainer paths reveal ownership. Unbounded caches and subscriptions are common production causes.

## Procedure
1. Establish a minimal reproducible loop such as mount/use/unmount or repeated route navigation.
2. Record baseline heap and force collection only for controlled diagnosis where tooling permits.
3. Repeat the loop enough times to expose a trend.
4. Compare snapshots and retained-object counts.
5. Follow dominator and retainer paths to the owning root.
6. Check listener, observer, timer, subscription, worker, and socket cleanup.
7. Bound caches and collections with explicit eviction semantics.
8. Fix lifecycle ownership rather than manually nulling unrelated references.
9. Repeat the same loop and compare post-GC steady state.
10. Test realistic long sessions and low-memory devices.

## Decision points
Retain data intentionally only when bounded and justified by reuse value. Use weak references only when semantics truly tolerate nondeterministic collection; do not use them to hide incorrect ownership. Prefer scoped lifecycle cleanup over global cleanup hooks.

## Common failure patterns
Calling every memory increase a leak; comparing snapshots before equivalent GC state; removing useful caches without proving retention; forgotten event listeners; unresolved promises retaining large state; detached DOM retained by closures.

## Verification
Confirm memory reaches a stable plateau over repeated cycles, retained-object counts stop growing, functionality remains correct, and GC/CPU behavior does not regress.

## Expected output
A reproducible leak case, retainer-path evidence, ownership fix, and before/after memory profile.

## Stop conditions
Escalate when the leak is inside a browser/runtime/vendor component, reproduction is nondeterministic, or remediation requires major state-management redesign.