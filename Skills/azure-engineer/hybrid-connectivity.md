# Hybrid Connectivity

## Purpose
Design resilient and secure connectivity between Azure and on-premises or other cloud networks.

## When to use
Use for VPN, ExpressRoute, hybrid migrations, private application access, network consolidation, and hybrid connectivity incidents.

## Inputs
Sites, CIDRs, bandwidth, latency, availability, encryption requirements, routing domains, BGP capability, and failover expectations.

## Context to inspect
Inspect VPN/ExpressRoute gateways, circuits, connections, BGP peers, route propagation, Local Network Gateways, Virtual WAN, firewalls, DNS, and effective routes.

## Core knowledge
Hybrid connectivity is a routing and failure-domain problem as much as a tunnel/circuit problem. BGP route advertisement, asymmetric paths, overlapping prefixes, gateway capacity, and DNS can independently break applications.

## Procedure
1. Map required hybrid traffic and criticality.
2. Validate non-overlapping address space.
3. Estimate bandwidth and latency needs.
4. Choose VPN, ExpressRoute, or combined design based on requirements.
5. Design gateway/circuit redundancy and BGP routing.
6. Define route filtering, default-route behavior, and inspection paths.
7. Integrate DNS resolution across boundaries.
8. Configure monitoring for tunnel/circuit, BGP, latency, and packet loss.
9. Test primary path, failover path, and return routing.
10. Document operational contacts and provider dependencies.

## Decision points
Use site-to-site VPN for lower-cost encrypted connectivity when internet-based characteristics are acceptable; use ExpressRoute when private connectivity, predictable capacity, or enterprise requirements justify it. A VPN can provide backup where appropriate.

## Common failure patterns
Overlapping CIDRs, only one physical/provider failure path, asymmetric routing through firewalls, untested BGP failover, undersized gateways, and treating DNS as unrelated.

## Verification
Test representative application flows, inspect learned/advertised routes, force planned path failure, measure convergence, and verify DNS during failover.

## Expected output
A hybrid connectivity design with capacity, routing, redundancy, security, DNS, and tested failover behavior.

## Stop conditions
Stop when address overlap cannot be resolved, carrier/provider details are unavailable, or failover testing could interrupt production without approval.