# Distributed Lock Safety Rules

## MUST
- Every lease acquisition must have an unambiguous ownership identity.
- Release must be atomic and conditional on ownership.
- Renewal must prove ownership and have a bounded lifetime or renewal count.
- A critical section that can outlive its lease must prevent stale-owner writes, preferably with fencing tokens when the protected resource can enforce them.
- Acquisition retries must be bounded and back off with jitter.
- Tests must cover two contenders, holder expiry, and a stale holder resuming after another holder acquires.
- Evidence must distinguish observed facts, hypotheses, decisions, and open questions.
- Preserve failed command/test output needed for diagnosis.

## MUST NOT
- Never delete a lock merely because its key/name matches.
- Never use an unlock operation that can release another owner's lease.
- Never retry lock acquisition indefinitely or busy-spin.
- Never assume a lease remains valid after blocking I/O, process suspension, GC pause, network partition, or timeout without checking backend semantics.
- Never use wall-clock timestamps as fencing tokens unless monotonic uniqueness is guaranteed by the coordination system.
- Never change production lock TTL, backend, topology, or cleanup state without explicit approval.
- Never silently increase permissions.
- Never mark the gate passed from static inspection alone when concurrency behavior can be tested.

## SHOULD
- Keep critical sections minimal and cancellation-aware.
- Prefer backend atomic primitives/scripts/transactions over client-side check-then-act sequences.
- Emit metrics for acquire latency, contention, renewals, expiry, ownership-loss and critical-section duration.
- Prefer deterministic local/integration tests over sleep-heavy timing tests; where timing is unavoidable, use generous bounds and explicit evidence.
