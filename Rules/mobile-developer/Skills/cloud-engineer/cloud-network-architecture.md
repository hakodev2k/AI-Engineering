# Cloud Network Architecture

## Purpose
Design secure, scalable connectivity between workloads, users, data centers, and external services.

## When to use
Use for new environments, hybrid connectivity, segmentation, private service access, or network bottlenecks.

## Inputs
Traffic flows, CIDR constraints, regions, DNS, latency needs, security zones, on-premises networks.

## Context to inspect
VPC/VNet topology, routes, firewalls, gateways, load balancers, DNS, peering, private endpoints, NAT, flow logs.

## Core knowledge
Network design balances isolation, routing simplicity, address space, cost, availability, and operational ownership. Connectivity does not imply authorization.

## Procedure
1. Map required traffic flows.
2. Allocate non-overlapping address space.
3. Define segmentation and trust zones.
4. Choose hub-spoke, transit, or simpler topology based on scale.
5. Design ingress, egress, DNS, and private service access.
6. Add resilient hybrid links where needed.
7. Apply least-access network controls.
8. Enable flow visibility.
9. Test failover, DNS, MTU, and routing paths.

## Decision points
Prefer private endpoints for sensitive services when operational complexity is justified. Avoid transit architectures for small estates without a real scaling need.

## Common failure patterns
Overlapping CIDRs, transitive-routing assumptions, unrestricted egress, DNS as an afterthought, asymmetric routes, and single-zone gateways.

## Verification
Test expected and forbidden flows, failover paths, DNS resolution, latency, and route convergence.

## Expected output
Documented network topology with controlled connectivity and operational diagnostics.

## Stop conditions
Escalate address-space conflicts, regulatory segmentation ambiguity, or dependencies on unowned external networks.