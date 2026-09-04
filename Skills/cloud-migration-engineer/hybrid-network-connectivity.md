# Hybrid Network Connectivity

## Purpose
Design and validate reliable, secure connectivity between source environments and cloud targets during coexistence and migration.

## When to use
Use when workloads, users, data, identity, or management systems span on-premises, colocation, multiple clouds, or migration regions.

## Inputs
Network diagrams, CIDRs, routing tables, DNS zones, traffic flows, bandwidth/latency baselines, firewall rules, VPN/direct-connect options, availability requirements, and migration waves.

## Preconditions
Address ownership and authoritative network teams must be known. Overlapping ranges and regulated network boundaries must be identified.

## Context to inspect
Inspect routing domains, NAT, MTU, BGP, asymmetric routing risk, DNS forwarding, proxies, TLS inspection, firewall policy, service endpoints, load balancers, bandwidth ceilings, and failure paths.

## Core knowledge
Migration traffic often differs from steady-state traffic. Data replication can saturate links. DNS and asymmetric routing create subtle failures. Redundant links do not provide resilience unless paths, devices, and control planes are sufficiently independent.

## Procedure
1. Map required flows by migration phase.
2. Inventory address spaces and detect overlaps.
3. Choose connectivity patterns based on bandwidth, latency, resilience, and lead time.
4. Define routing ownership and route propagation boundaries.
5. Design DNS resolution across environments.
6. Define firewall and egress policy using least privilege.
7. Estimate replication and cutover bandwidth.
8. Validate MTU, NAT, proxy, and TLS requirements.
9. Build redundant paths for critical workloads where justified.
10. Test connectivity from actual workload subnets.
11. Simulate link/path failure and observe convergence.
12. Monitor latency, loss, utilization, and routing changes during waves.
13. Remove temporary migration rules after stabilization.

## Decision points
Use private dedicated connectivity for sustained high-volume or latency-sensitive traffic when economics and lead time justify it; use VPN for lower-volume, rapid, or backup connectivity. Prefer private service access when exposure reduction matters.

## Common failure patterns
CIDR overlap discovered late; broad temporary firewall rules becoming permanent; DNS split-horizon errors; insufficient replication bandwidth; single-path designs labeled redundant; ignoring MTU; route leaks; asymmetric return paths.

## Verification
Run synthetic and application-level tests for every critical flow. Validate failover, DNS resolution, throughput, latency, and firewall logging. Compare measured replication rates with cutover assumptions.

## Expected output
A validated hybrid connectivity design, flow matrix, test evidence, monitoring plan, and cleanup list.

## Stop conditions
Escalate when address overlap lacks a safe remediation, connectivity lead times threaten the wave, required routes violate security boundaries, or resilience tests fail.