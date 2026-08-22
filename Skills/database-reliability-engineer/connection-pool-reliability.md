# Connection Pool Reliability

## Purpose
Prevent connection management from becoming a database outage amplifier.

## When to use
Use for connection exhaustion, timeout spikes, failover recovery problems, or high application fan-out.

## Inputs
Pool configuration, database connection limits, service replica counts, timeout settings, traffic patterns, and failover behavior.

## Context to inspect
Per-process pools, max/min sizes, connection lifetime, idle behavior, retry policy, proxies, and database session metrics.

## Core knowledge
Total possible connections equal pools multiplied across application instances and workers. Oversized pools can overwhelm databases; undersized pools create application queueing.

## Procedure
1. Inventory all connection-producing clients.
2. Calculate theoretical and observed connection demand.
3. Reserve capacity for operations and failover.
4. Tune pool bounds from workload evidence.
5. Configure acquisition and command timeouts separately.
6. Validate stale-connection handling after failover.
7. Add metrics for pool wait, active, idle, and failed connections.
8. Load-test scaling and restart storms.

## Decision points
Use a database proxy/pooler when client fan-out or connection setup cost warrants it; avoid adding another dependency without operational benefit.

## Common failure patterns
Unlimited pools, synchronized reconnect storms, long connection lifetimes across topology changes, and confusing pool timeout with query timeout.

## Verification
Test peak load, application scale-out, database failover, and rolling restarts while monitoring pool and server limits.

## Expected output
Safe pool sizing, timeout policy, failover behavior, and operational metrics.

## Stop conditions
Escalate when database limits cannot support required concurrency or changing pool semantics risks application correctness.