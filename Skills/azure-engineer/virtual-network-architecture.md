# Virtual Network Architecture

## Purpose
Design Azure network topology that provides required connectivity while controlling trust, routing, scale, and operational complexity.

## When to use
Use for new network foundations, workload onboarding, hybrid connectivity, segmentation, peering changes, or recurring reachability problems.

## Inputs
Address-space inventory, workloads, regions, trust zones, on-premises networks, throughput needs, DNS requirements, and compliance constraints.

## Context to inspect
Inspect VNets, subnets, peerings, route tables, gateways, firewalls, private endpoints, NSGs, service endpoints, DNS links, and overlapping CIDRs.

## Core knowledge
Azure routing combines system routes, user-defined routes, peering, and gateway propagation. Network boundaries should reflect trust and traffic requirements, not arbitrary resource grouping. Address-space planning is difficult to repair later.

## Procedure
1. Map traffic flows and trust boundaries.
2. Inventory all current and planned address ranges.
3. Reserve non-overlapping CIDRs with growth headroom.
4. Choose topology such as hub/spoke or Virtual WAN based on scale and connectivity needs.
5. Define subnet boundaries and delegated-service requirements.
6. Design ingress, egress, east-west inspection, and routing.
7. Define private connectivity and DNS behavior.
8. Apply NSGs and route tables deliberately.
9. Validate asymmetric-routing and transitive-connectivity risks.
10. Test representative flows and failure scenarios.

## Decision points
Use peering for direct low-latency VNet connectivity; use centralized transit when governance and shared inspection justify it. Prefer private endpoints for sensitive PaaS access when operational DNS complexity is acceptable.

## Common failure patterns
Overlapping address spaces, tiny subnets, implicit transitive-routing assumptions, broad NSGs, undocumented UDRs, forced tunneling without capacity planning, and private endpoints without DNS design.

## Verification
Verify effective routes, NSG rules, DNS resolution, latency, throughput, expected denied flows, gateway failover, and connectivity from representative source subnets.

## Expected output
A scalable Azure network design with explicit address, routing, segmentation, connectivity, and validation rules.

## Stop conditions
Stop when address ownership is unresolved, required CIDRs overlap with networks that must connect, or a routing change could isolate production without tested rollback.