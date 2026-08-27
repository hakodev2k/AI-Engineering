# Concurrency and Consistency

## Purpose
Prevent races, torn interpretations, and invalid synchronization assumptions in eBPF state.

## Scope
Map updates, per-CPU state, atomics, spin locks, sequence patterns, userspace readers, and multi-program access.

## MUST
- Shared mutable state MUST have documented concurrency and consistency semantics.
- Atomicity requirements MUST be satisfied by primitives valid for the target program/map context.
- Userspace readers MUST tolerate the consistency model actually provided by kernel-side updates.
- Locking MUST obey helper/context restrictions and keep critical sections bounded.

## MUST NOT
- MUST NOT assume per-CPU storage eliminates all consistency issues during aggregation.
- MUST NOT compose multiple independent map operations as if they were transactional.
- MUST NOT hold eBPF spin locks across prohibited helper calls.

## SHOULD
- Prefer immutable or append-like state where feasible.
- Prefer per-CPU counters for independent hot-path increments.

## Exceptions
Weaker consistency requires explicit semantic impact, evidence that consumers tolerate it, and tests.

## Verification
Use stress tests, concurrent producer/reader tests, invariant checks, code review of synchronization, and architecture-specific testing when atomics matter.