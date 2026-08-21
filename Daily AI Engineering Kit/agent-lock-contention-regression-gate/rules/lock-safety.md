# Lock Safety Rules

## MUST
- Identify every changed synchronization primitive and the shared state it protects.
- Preserve correctness invariants before optimizing contention.
- Keep lock acquisition order explicit when multiple locks can be held.
- Capture before/after evidence for any claimed contention improvement.
- Run a relevant concurrency/contention test or equivalent observable signal.
- Inspect whether I/O, sleeps, blocking waits, logging sinks, callbacks, or database/network calls execute while synchronization is held.
- Require independent verification before status `pass`.
- Stop for approval before weakening concurrency guarantees, changing production configuration, destructive SQL, database schema change, or unsafe lock-free replacement.

## MUST NOT
- Remove a lock/semaphore solely because a benchmark becomes faster.
- Replace synchronization with unsynchronized shared mutable state.
- Use `.Result`, `.Wait()`, or `Thread.Sleep` in an async hot path introduced or modified by the task unless explicitly justified and verified.
- Hold a process-local lock across an external network/database call when the same correctness can be preserved outside the critical section.
- Introduce inconsistent lock ordering between execution paths.
- Claim a contention regression is fixed without comparable evidence.
- Run destructive production experiments or increase permissions to collect evidence.

## SHOULD
- Minimize critical-section duration and protected state.
- Prefer async-compatible coordination for async execution paths.
- Prefer immutable data, partitioned state, optimistic concurrency, or message serialization when they clearly preserve required semantics.
- Add regression tests around deadlock, starvation, duplicate work, ordering, and timeout behavior when relevant.
- Record open risks when load characteristics cannot be reproduced locally.
