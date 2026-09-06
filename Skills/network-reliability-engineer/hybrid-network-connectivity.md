# Hybrid Network Connectivity

## Purpose
Design and troubleshoot reliable connectivity between on-premises, colocation, and cloud environments while preserving routing correctness and failure isolation.

## When to use
Use for cloud migrations, private circuits, VPN backup paths, route-domain integration, or hybrid connectivity incidents.

## Inputs
On-prem and cloud topology, circuit inventory, BGP policy, VPN design, route tables, DNS dependencies, and traffic requirements.

## Context to inspect
Inspect primary/backup path preference, overlapping CIDRs, asymmetric paths, provider demarcation, encryption requirements, and cloud transit dependencies.

## Core knowledge
Hybrid reliability depends on independent paths, deterministic route preference, compatible MTUs, clear failure domains, and tested failover between private circuits and tunnels.

## Procedure
1. Map all hybrid traffic flows and trust boundaries.
2. Validate address-space uniqueness.
3. Document primary and backup route preference.
4. Check private-circuit and VPN underlay independence.
5. Validate route propagation and filtering.
6. Inspect DNS and identity dependencies crossing the boundary.
7. Test failover and restoration in controlled conditions.
8. Measure convergence, loss, and application recovery.
9. Document operational ownership across providers.

## Decision points
Use private circuits for predictable latency and throughput; retain VPN backup when availability requirements justify it. Avoid automatic failover when the backup cannot sustain production load.

## Common failure patterns
Backup paths with insufficient capacity, overlapping address space, stale route propagation, shared physical providers, asymmetric firewall paths, and failback oscillation.

## Verification
Validate route state, application traffic, failover timing, backup capacity, and restoration to the preferred path.

## Expected output
A verified hybrid connectivity design with explicit path preference and recovery behavior.

## Stop conditions
Escalate when provider coordination is required or failover testing could exceed backup capacity.