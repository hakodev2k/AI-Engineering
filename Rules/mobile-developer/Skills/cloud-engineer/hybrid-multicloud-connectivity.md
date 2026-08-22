# Hybrid and Multi-Cloud Connectivity

## Purpose
Design reliable connectivity and service boundaries across cloud providers, data centers, and edge environments.

## When to use
Use for migrations, regulatory placement, acquisitions, multi-cloud products, or retained on-premises dependencies.

## Inputs
Sites/providers, CIDRs, bandwidth, latency, routing, DNS, identity, security and availability requirements.

## Context to inspect
VPNs, dedicated circuits, transit gateways, BGP, DNS forwarding, firewalls, proxies, certificates, monitoring.

## Core knowledge
Cross-environment connectivity adds failure domains, latency, cost, routing complexity, and organizational boundaries. Multi-cloud should solve a concrete requirement, not be a default goal.

## Procedure
1. Map required cross-boundary flows.
2. Resolve address-space overlap.
3. Define routing ownership and advertisements.
4. Select VPN or dedicated connectivity based on throughput and resilience.
5. Design redundant paths.
6. Establish DNS resolution and service discovery.
7. Apply encryption and network policy.
8. Measure latency and transfer cost.
9. Monitor tunnel/circuit and route health.
10. Test path failure and recovery.

## Decision points
Prefer provider-native private connectivity for critical predictable traffic when justified; internet VPN may suffice for lower-volume resilient use cases.

## Common failure patterns
Overlapping networks, single circuits, route leaks, asymmetric routing, undocumented DNS dependencies, and chatty cross-cloud architectures.

## Verification
Test failover, route convergence, DNS, throughput, latency, and prohibited paths.

## Expected output
A bounded, monitored cross-environment connectivity design.

## Stop conditions
Escalate unresolved routing ownership, address conflicts, or compliance constraints.