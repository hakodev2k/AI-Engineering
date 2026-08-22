# Network Failure Experiments

## Purpose
Test behavior under latency, packet loss, connection resets, DNS failures, partitions, and bandwidth constraints.

## When to use
Use for distributed systems where network assumptions affect availability or consistency.

## Inputs
Network topology, protocols, timeout budgets, retry policies, service discovery, and consistency requirements.

## Context to inspect
Inspect client/server timeout hierarchy, load balancers, proxies, DNS caching, connection pools, keep-alives, and cross-zone or cross-region paths.

## Core knowledge
Networks can be slow or asymmetric rather than simply down. Faults interact with retries, leader election, leases, and connection pools.

## Procedure
1. Identify a network assumption to challenge.
2. Select a specific path and bounded fault.
3. Establish latency and error baselines.
4. Inject latency or loss before full partition where appropriate.
5. Monitor retries, saturation, failover, and correctness.
6. Test recovery when connectivity returns.
7. Inspect for duplicate work, stale connections, and split-brain symptoms.

## Decision points
Choose proxy-level injection for application precision and network/platform controls for infrastructure realism. Test asymmetric faults when protocols depend on bidirectional reachability.

## Common failure patterns
Unbounded latency injection, retry storms, timeout inversion, DNS assumptions, stale pooled connections, and declaring success because processes remain alive.

## Verification
Verify user-facing SLO behavior, bounded resource consumption, correct failover, and clean reconnection.

## Expected output
Measured network-failure behavior and concrete resilience improvements.

## Stop conditions
Stop for uncontrolled partition scope, data-integrity risk, or inability to restore routing predictably.