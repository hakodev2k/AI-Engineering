# Connection Pooling and Session Management

## Purpose
Control database connection concurrency so applications use database resources efficiently without connection storms, leaks, or session-state surprises.

## When to use
Use for connection exhaustion, autoscaling applications, intermittent login failures, high session counts, pool tuning, and database proxy design.

## Inputs
Application instance count, pool settings, database connection limits, transaction duration, query latency, autoscaling behavior, and connection telemetry.

## Context to inspect
Inspect client pool defaults, maximum pools per instance, idle lifetimes, leaked connections, server session memory, proxies, failover behavior, and session-scoped settings.

## Core knowledge
More connections do not imply more throughput. Excess concurrency can increase queueing, context switching, locks, and memory pressure. Pool capacity must be reasoned across all application instances.

## Procedure
1. Measure active, idle, waiting, and failed connections.
2. Calculate theoretical maximum connections across deployed instances.
3. Compare demand with database capacity and useful concurrency.
4. Find leaked or unnecessarily long-held connections.
5. Shorten transactions and release connections promptly.
6. Set bounded pool sizes and acquisition timeouts.
7. Coordinate application autoscaling with database limits.
8. Evaluate a connection proxy/pooler where architecture benefits.
9. Reset or avoid unsafe session state between pooled users.
10. Test failover and connection re-establishment.

## Decision points
Increase pool size only when requests wait for connections while the database still has processing headroom. Reduce concurrency when the database is already saturated.

## Common failure patterns
Per-instance defaults multiplied by hundreds of instances, opening connections around network calls, infinite waits, and assuming pooled sessions have clean state automatically.

## Verification
Load test connection acquisition, database throughput, failover recovery, and maximum session counts.

## Expected output
A bounded connection strategy aligned with database and application scaling behavior.

## Stop conditions
Escalate when required application concurrency fundamentally exceeds database architecture capacity.