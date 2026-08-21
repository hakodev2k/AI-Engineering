# Network Architecture

## Purpose
Design secure, reliable connectivity and traffic flow across applications, cloud services, on-premises systems, users, and third parties.

## When to use
Use for cloud landing zones, hybrid integration, private services, ingress/egress design, segmentation, and multi-region systems.

## Inputs
System context, trust boundaries, traffic flows, DNS, identity, compliance, latency, connectivity requirements.

## Preconditions
Endpoints and communication directions are known.

## Context to inspect
VNets/VPCs, subnets, routing, firewalls, proxies, load balancers, DNS, NAT, private endpoints, VPN/ExpressRoute/direct connect, TLS termination.

## Core knowledge
Network architecture should minimize unnecessary exposure, control egress, preserve observability, and avoid brittle address/routing assumptions. Network controls complement identity controls.

## Procedure
1. Map required traffic flows and protocols.
2. Classify public, private, partner, and management paths.
3. Define segmentation boundaries.
4. Design ingress with authentication, TLS, WAF/rate controls where relevant.
5. Control egress and third-party destinations.
6. Design DNS and service discovery.
7. Plan hybrid routing and address ranges.
8. Model HA and failure domains.
9. Add flow logging and diagnostics.
10. Validate latency, MTU, firewall, and name-resolution assumptions.

## Decision points
Use private connectivity when risk/compliance warrants it. Avoid private networking that creates excessive operational complexity without reducing meaningful risk.

## Common failure patterns
Overlapping CIDRs, open egress, DNS as an afterthought, hidden transitive routing, public endpoints protected only by obscurity.

## Verification
Connectivity tests and security review confirm only intended flows are possible.

## Expected output
Network topology, routing/security rules, and diagnostic plan.

## Stop conditions
Stop when enterprise network ownership or IP planning is unresolved.