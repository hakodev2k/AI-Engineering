# Connection Pooling

## Purpose
Control PostgreSQL connection concurrency so application demand does not exhaust backend memory, process capacity, or transaction throughput.

## When to use
Use for connection storms, serverless workloads, PgBouncer adoption, max_connections tuning, or saturation incidents.

## Inputs
Client counts, pool settings, transaction rates, query latency, server resources, session-feature requirements.

## Context to inspect
Application pools, proxies, max_connections, active/idle sessions, prepared statements, temp tables, session state and authentication.

## Core knowledge
Each PostgreSQL backend has cost; more connections do not imply more throughput. Pooling modes differ: session preserves session state; transaction pooling increases multiplexing but constrains session-dependent behavior.

## Procedure
1. Measure active versus idle connections and peak concurrency.
2. Estimate useful database concurrency from CPU/IO/workload.
3. Inventory session-dependent features.
4. Choose pooling location and mode.
5. Set bounded client/server pools and acquisition timeouts.
6. Coordinate application pool totals across replicas/instances.
7. Test prepared statements and transaction semantics.
8. Load-test saturation behavior.
9. Monitor queue time and server utilization.
10. Document limits.

## Decision points
Prefer transaction pooling for stateless transactional workloads; session pooling when session state is essential.

## Common failure patterns
Multiplying per-instance pools, raising max_connections as first fix, idle-in-transaction sessions, unbounded connection retries.

## Verification
Demonstrate stable throughput, bounded queueing, no connection exhaustion, and correct session semantics.

## Expected output
Pool architecture, sizing rationale, configuration and load-test evidence.

## Stop conditions
Stop if required application session semantics are unknown or cannot work with selected pooling mode.