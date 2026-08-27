# Cloud Network Architecture

## Purpose
Design cloud network topologies that satisfy connectivity, isolation, scale, reliability, security, and operability requirements without inheriting accidental complexity.

## When to use
Use for a new cloud landing zone, major network redesign, multi-account/subscription expansion, or review of a topology that has become difficult to operate. Do not redesign solely for aesthetic consistency.

## Inputs
Business connectivity requirements, cloud providers/regions, workloads, trust boundaries, traffic flows, availability targets, compliance constraints, expected growth, and existing diagrams/configuration.

## Preconditions
Obtain authoritative inventory and current routing/security state. Treat diagrams as hypotheses until configuration confirms them.

## Context to inspect
Inspect VPC/VNet structure, CIDRs, route tables, gateways, load balancers, DNS, private endpoints, firewalls, peering/transit, hybrid links, Kubernetes networks, IaC, quotas, telemetry, and incident history.

## Core knowledge
Prefer explicit trust boundaries and predictable routing. Hub-and-spoke, transit, mesh, and segmented topologies have different blast-radius, cost, latency, and operational characteristics. Network architecture must account for control-plane limits and failure domains, not only nominal connectivity.

## Procedure
1. Map producers, consumers, protocols, ports, directions, and data sensitivity.
2. Define isolation and failure domains before selecting topology.
3. Forecast address-space and route-scale growth.
4. Choose regional and inter-region connectivity patterns.
5. Define ingress, egress, east-west, hybrid, and management paths.
6. Place security enforcement points deliberately.
7. Design DNS and service discovery with routing.
8. Eliminate unintended transitive connectivity.
9. Model component and region failures.
10. Define observability and ownership boundaries.
11. Encode the approved design in IaC and diagrams.
12. Validate with staged connectivity and failure tests.

## Decision points
Choose centralized transit when governance and scale outweigh added dependency; direct peering when simplicity and latency dominate at small scale. Prefer regional autonomy when cross-region dependencies would enlarge failure domains.

## Common failure patterns
Overlapping CIDRs, hidden transitive routes, one shared flat network, centralized appliances without capacity planning, asymmetric routing, undocumented exceptions, and architecture diagrams drifting from reality.

## Verification
Verify route reachability, denied paths, failover behavior, quota headroom, latency, throughput, DNS resolution, telemetry, and IaC reproducibility. Implementation is not verified until expected and forbidden flows are tested.

## Expected output
An evidence-backed target topology, traffic-flow matrix, routing/security model, failure analysis, migration plan, and operational ownership model.

## Stop conditions
Stop when critical traffic requirements are unknown, destructive migration is unavoidable without approval, provider limits invalidate the design, or required security/compliance decisions lack an owner.