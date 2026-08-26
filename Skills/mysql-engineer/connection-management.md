# Connection Management

## Purpose
Control MySQL connection lifecycle and concurrency so connection storms and excess sessions do not destabilize the server.

## When to use
Use for connection errors, high thread/session counts, pool tuning, autoscaling, or proxy adoption.

## Inputs
Application pool settings, instance count, max_connections, session metrics, authentication latency, workload concurrency.

## Context to inspect
Pool min/max, idle lifetime, timeouts, server thread behavior, transaction scope, proxies, failover behavior, per-session memory.

## Core knowledge
Connections consume server resources and pool multiplication across many application instances can exceed safe limits. Pool size should reflect useful database concurrency, not application request concurrency.

## Procedure
1. Measure active versus idle connections and concurrency.
2. Inventory pools across all clients and replicas.
3. Calculate worst-case aggregate connections during autoscaling/failover.
4. Set bounded pool sizes and acquisition timeouts.
5. Ensure connections are returned promptly and transactions close reliably.
6. Configure idle/lifetime recycling to support failover and credential rotation.
7. Consider a proxy only for a demonstrated operational need.
8. Load-test startup bursts and failover reconnection.
9. Monitor pool waits, server sessions, and aborted connections.

## Decision points
Increase pool size only when pool wait is causal and DB has spare concurrency. Use a proxy when multiplexing/routing benefits outweigh another stateful dependency.

## Common failure patterns
Raising max_connections indefinitely, pool per worker without aggregate budgeting, leaked transactions, synchronized reconnect storms, and unlimited acquisition waits.

## Verification
Prove stable throughput and latency under peak instance count, restart, and failover without exhausting server connections.

## Expected output
Connection budget and tested client/server pool configuration.

## Stop conditions
Stop if application ownership is unclear, aggregate client counts cannot be bounded, or proxy introduction lacks failure-mode testing.