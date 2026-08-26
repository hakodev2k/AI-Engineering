# Threading and Concurrency Rules
## Purpose
Prevent races, deadlocks, priority inversions, and unsafe cross-thread lifetime behavior.
## Scope
Threads, task runners, locks, atomics, worker pools, and asynchronous callbacks.
## MUST
- Thread-affinity and synchronization invariants MUST be explicit for shared state.
- Cross-thread tasks MUST carry only state whose lifetime remains valid until execution or cancellation.
- Lock ordering MUST be defined where multiple locks can be acquired.
## MUST NOT
- MUST NOT block latency-sensitive threads on unbounded work or external events.
- MUST NOT use relaxed synchronization without a documented memory-order argument.
## SHOULD
- SHOULD prefer message passing and immutable snapshots over shared mutable state.
## Exceptions
Complex synchronization requires concurrency-owner review and stress evidence.
## Verification
Use thread sanitizers, stress tests, deadlock detection, sequence assertions, traces, and code review.