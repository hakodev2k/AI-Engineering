# Concurrency Control Rules

## Purpose
Prevent lost updates, write skew, duplicate effects, and unsafe contention.

## Scope
Locks, MVCC, optimistic concurrency, compare-and-set, leases, and distributed coordination.

## MUST
- Concurrent mutation paths MUST identify possible anomalies and the mechanism preventing unacceptable outcomes.
- Optimistic writes MUST validate versions or equivalent preconditions atomically.
- Leases and distributed locks MUST define expiry, fencing, ownership, and failure behavior.
- Contention-sensitive operations MUST expose retry and conflict metrics.

## MUST NOT
- MUST NOT rely on process-local locks for cross-node correctness.
- MUST NOT use a distributed lock without fencing when stale holders can perform dangerous writes.
- MUST NOT hide conflict retries until latency becomes unbounded.

## SHOULD
- Prefer invariant-preserving atomic primitives over broad locks.

## Exceptions
Weaker controls require proof that resulting anomalies are harmless or repaired deterministically.

## Verification
Stress concurrent paths, inject delays, inspect isolation settings, and validate invariant checks.