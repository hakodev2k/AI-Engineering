# Database Observability

## Purpose
Expose database workload, latency, contention, query behavior, and resource saturation without relying on application symptoms alone.

## When to use
Use for production databases, slow-query investigations, capacity planning, and application/database boundary diagnosis.

## Inputs
Database engine, workload, query telemetry, connection pools, execution plans, resource metrics, and SLOs.

## Context to inspect
Inspect query latency distributions, waits, locks, deadlocks, connections, cache hit behavior, I/O, CPU, replication lag, and top query fingerprints.

## Core knowledge
Database symptoms must be interpreted with workload context. Query fingerprints are safer and more useful than raw SQL with parameters. Application pool exhaustion can mimic database failure.

## Procedure
1. Define database-dependent user journeys.
2. Measure connection and query latency.
3. Capture normalized query fingerprints.
4. Monitor waits, locks, deadlocks, and saturation.
5. Correlate application traces with database spans.
6. Track replication and backup health where relevant.
7. Build top-query and contention views.
8. Validate during controlled load.

## Decision points
Use database-native telemetry for engine internals and application tracing for request causality. Avoid high-overhead statement capture in production without testing.

## Common failure patterns
Only monitoring CPU, storing sensitive SQL parameters, blaming the database before checking pool behavior, and ignoring tail latency or lock waits.

## Verification
Reproduce representative load and confirm slow queries, contention, pool pressure, and dependency impact are distinguishable.

## Expected output
Correlated database and application telemetry suitable for diagnosis and capacity review.

## Stop conditions
Escalate when diagnostic collection could materially affect production database performance.