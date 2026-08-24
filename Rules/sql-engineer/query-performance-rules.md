# Query Performance Rules

## Purpose
Prevent SQL latency, throughput, CPU, I/O, and concurrency regressions through evidence-based tuning.

## Scope
Interactive queries, batch SQL, stored modules, reports, and database-facing application queries.

## MUST
- Performance claims MUST use before/after measurements under comparable conditions.
- Expensive queries MUST be investigated using actual or representative execution evidence, including plans and runtime metrics where available.
- Tuning MUST consider cardinality, data distribution, I/O, CPU, memory, waits, concurrency, and plan stability.
- Performance-sensitive changes MUST preserve result correctness.

## MUST NOT
- MUST NOT add hints, indexes, rewrites, or configuration changes solely from intuition.
- MUST NOT optimize a synthetic micro-case while ignoring representative production workload characteristics.
- MUST NOT trade correctness or isolation guarantees for speed without explicit approval and documented impact.

## SHOULD
- Establish latency/throughput targets before tuning.
- Prefer eliminating unnecessary work, rows, columns, sorts, and round trips before adding complexity.

## Exceptions
Emergency mitigations may precede full diagnosis only when impact is active; they require bounded scope, monitoring, rollback, and follow-up evidence.

## Verification
Capture plans and runtime statistics, compare logical/physical reads and duration, test representative parameter values and concurrency, inspect regressions, and retain measurement evidence with the change.