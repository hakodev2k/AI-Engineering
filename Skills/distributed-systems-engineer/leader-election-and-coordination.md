# Leader Election and Coordination

## Purpose
Coordinate exclusive or ordered distributed work safely when multiple instances may compete to act.

## When to use
Use for singleton schedulers, partition ownership, active/passive controllers, metadata coordination, and tasks requiring one current authority.

## Inputs
Coordination requirement, failure model, lease/consensus service guarantees, timing assumptions, and critical side effects.

## Context to inspect
Inspect deployment multiplicity, lock/lease implementation, clocks, network partitions, restart behavior, and downstream fencing support.

## Core knowledge
A distributed lock is not automatically safe after pauses or partitions. Leases expire, processes can resume after losing ownership, and clocks are imperfect. Fencing tokens or authoritative epochs protect downstream resources from stale leaders.

## Procedure
1. Confirm coordination is actually required.
2. Define the protected invariant.
3. Choose a coordination system with suitable guarantees.
4. Prefer leases/epochs over permanent locks.
5. Generate monotonic fencing tokens where stale actors could write.
6. Define renewal, loss-of-leadership, and shutdown behavior.
7. Make workers stop promptly when ownership is lost.
8. Test process pauses, partitions, duplicate leaders, and recovery.
9. Monitor leadership churn and lease failures.

## Decision points
Prefer partitioned ownership or idempotent concurrent work when possible. Use leader election only where one authority materially simplifies or protects correctness.

## Common failure patterns
Database boolean flags as locks, assuming lease holder remains leader until it notices expiry, no fencing, and depending on synchronized clocks.

## Verification
Force pauses and partitions and prove stale leaders cannot commit protected side effects after ownership changes.

## Expected output
A coordination protocol with ownership, fencing, recovery, and telemetry.

## Stop conditions
Stop when the selected coordination primitive cannot provide the required safety guarantee.