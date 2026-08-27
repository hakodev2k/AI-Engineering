# Hybrid Cloud Connectivity

## Purpose
Engineer resilient connectivity between cloud and on-premises, colocation, branch, or other external networks.

## When to use
Use for VPN, dedicated circuits, Direct Connect/ExpressRoute-style services, hybrid migrations, or connectivity reliability/performance incidents.

## Inputs
Sites, prefixes, bandwidth, latency, availability targets, routing policy, encryption requirements, provider locations, and application dependencies.

## Preconditions
Confirm physical/logical demarcations, ownership, and existing routing advertisements.

## Context to inspect
Circuits, VPN tunnels, BGP sessions, provider gateways, routers, route filters, encryption, MTU, NAT, redundancy, monitoring, and carrier SLAs.

## Core knowledge
Dedicated circuits improve predictable capacity but do not automatically provide end-to-end redundancy or encryption. Hybrid reliability depends on independent failure domains, routing convergence, and tested failover.

## Procedure
1. Inventory hybrid flows and criticality.
2. Establish bandwidth/latency and recovery objectives.
3. Select VPN, dedicated circuit, or combined design.
4. Design redundant physical/provider paths where justified.
5. Define BGP advertisements and preference policy.
6. Address encryption and MTU requirements.
7. Prevent unintended route propagation.
8. Configure monitoring for tunnel/session/circuit and application path.
9. Test path loss and convergence under load.
10. Document provider escalation and failback procedures.

## Decision points
Use VPN for rapid deployment/lower throughput; dedicated connectivity for sustained predictable traffic; combine them when backup diversity is required. Active-active improves utilization but increases routing complexity.

## Common failure patterns
Two logical links sharing one physical failure domain, untested backup VPNs, asymmetric routing, MTU black holes, unrestricted route advertisements, and capacity assumptions based on circuit headline speed.

## Verification
Fail each path deliberately in a safe environment, measure convergence, packet loss, throughput, MTU behavior, route correctness, and recovery.

## Expected output
A hybrid topology, routing policy, redundancy model, capacity evidence, monitoring, and operational runbook.

## Stop conditions
Stop when carrier/provider ownership is unclear, production failover testing lacks approval, or route changes could isolate sites without rollback.