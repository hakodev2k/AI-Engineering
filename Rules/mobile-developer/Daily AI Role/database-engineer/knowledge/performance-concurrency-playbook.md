# Performance and Concurrency Playbook

## Diagnose by resource and queue
Ask what is saturated or waiting: CPU, storage IO, memory grant, worker/thread, lock, latch, log/WAL flush, network, replica apply, connection pool, or external dependency.

## Plan evidence
Prefer actual/representative plans and runtime statistics. Check estimates versus actual rows, parameter sensitivity, scans, lookups, spills, sorts, join choice, predicate sargability, and statistics freshness.

## Index trade-offs
Indexes accelerate selected reads but consume storage/cache, increase write/log/replication work, add maintenance, and can overlap. Key order should follow equality/range/order/join patterns and real selectivity.

## Transactions
Long transactions extend lock/version retention and recovery work. Keep transaction scope aligned with the invariant, not with unrelated application orchestration.

## Deadlocks
Treat deadlock as a graph: competing transactions acquire resources in conflicting order. Fix access path/order/duration where possible; retry only the victim operation with bounded policy and idempotent semantics.

## Isolation
Changing isolation is a correctness decision. State which anomalies become possible and why domain invariants still hold.

## Hotspots
Hot rows/partitions/sequence resources may require sharding, queueing, aggregation, batching, optimistic control, or changed business workflow; adding hardware may only postpone the same serialization limit.

## Comparative testing
Match parameter distribution, data volume, cache state where relevant, concurrency, engine settings, and observation window. Report uncertainty rather than presenting noisy samples as proof.