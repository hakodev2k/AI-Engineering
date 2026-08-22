# Hybrid and Multi-Cloud Connectivity

## Purpose
Connect data centers, branches, and multiple clouds with predictable routing, security, availability, and operational ownership.

## When to use
Use for dedicated circuits, cloud interconnects, transit networks, mergers, multi-cloud services, or cross-environment latency/reachability issues.

## Inputs
Sites/clouds, CIDRs, bandwidth, latency, route scale, providers, SLAs, security boundaries, application dependencies, and DR requirements.

## Context to inspect
Inspect circuits, VPN backups, BGP, transit gateways, carrier handoffs, route filters, NAT, DNS, MTU, QoS, and monitoring on both sides of provider boundaries.

## Core knowledge
Hybrid connectivity spans administrative domains; end-to-end reliability is limited by shared dependencies and unclear demarcation. Route policy and address planning determine long-term scalability.

## Procedure
1. Map environments and critical flows.
2. Identify address overlaps and route scale.
3. Define primary/backup paths and failure domains.
4. Establish routing policy and advertisements.
5. Design security inspection without unintended hairpins.
6. Align MTU and QoS expectations.
7. Integrate cross-environment DNS.
8. Define provider and internal ownership boundaries.
9. Test path loss, circuit failover, and restoration.
10. Measure latency, throughput, and packet loss against targets.

## Decision points
Use dedicated connectivity for predictable capacity/latency and VPN for flexibility or backup. Centralized transit simplifies governance but can create cost and blast-radius concentration.

## Common failure patterns
Overlapping CIDRs, asymmetric failover, route preference mistakes, backup links never tested, provider monitoring gaps, MTU mismatches, and cross-cloud traffic unexpectedly traversing on-premises.

## Verification
Test route propagation, primary/backup convergence, application flows, DNS, MTU, throughput, telemetry, and provider escalation paths.

## Expected output
A resilient connectivity design with route policy, security, failover, capacity, ownership, and tested recovery.

## Stop conditions
Stop when provider demarcation is unclear, overlapping addressing lacks an approved strategy, or failover testing risks critical traffic without coordination.