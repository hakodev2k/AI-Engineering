# Network Security Architecture

## Purpose
Design network boundaries, connectivity, filtering, and trust relationships that reduce exposure and contain compromise.

## When to use
Use for new environments, service segmentation, cloud networking, zero-trust initiatives, internet-facing systems, or after lateral-movement incidents.

## Inputs
Network topology, service inventory, data flows, identity model, ingress/egress requirements, administrative access paths, threat model.

## Context to inspect
Public endpoints, DNS, firewalls/security groups, proxies, service meshes, private endpoints, VPNs, peering, egress paths, management ports, and network telemetry.

## Core knowledge
Network controls should complement identity and application authorization, not replace them. Minimize reachable attack surface, separate management paths, restrict egress where useful, and avoid implicit trust based only on network location.

## Procedure
1. Map required communication flows and their owners.
2. Classify trust zones and sensitive destinations.
3. Remove unnecessary public exposure.
4. Restrict inbound access to required sources, protocols, and ports.
5. Constrain east-west traffic where segmentation reduces blast radius.
6. Define egress controls for sensitive workloads.
7. Isolate management and administrative interfaces.
8. Protect DNS, proxy, and certificate termination points.
9. Add flow logs and alerts for anomalous connectivity.
10. Test intended and denied paths from representative network locations.

## Decision points
Prefer identity-aware controls when users or workloads move across networks. Use network segmentation when it materially limits attacker movement or protects sensitive assets.

## Common failure patterns
Flat networks, allow-any internal rules, exposed management ports, unrestricted egress, forgotten peering paths, security groups shared across unrelated workloads, and treating private IP space as trusted.

## Verification
Connectivity tests prove required paths work and unauthorized paths fail; external exposure inventories and network logs match the intended design.

## Expected output
An explicit network security architecture with limited exposure, segmented trust zones, controlled ingress/egress, and verification evidence.

## Stop conditions
Escalate when required connectivity is unknown, shared network changes could affect unrelated systems, or production firewall changes require change approval.