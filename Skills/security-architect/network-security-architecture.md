# Network Security Architecture

## Purpose
Design network boundaries, connectivity controls, inspection points, and resilience patterns that reduce exposure without breaking required communication.

## When to use
Use for data centers, cloud networks, hybrid connectivity, internet-facing services, partner links, and sensitive internal zones.

## Inputs
Network diagrams, application dependencies, ports and protocols, identity model, trust zones, availability requirements, traffic volumes.

## Preconditions
Critical service dependencies and required communication paths are known.

## Context to inspect
Ingress and egress paths, routing, DNS, load balancers, firewalls, proxies, private endpoints, segmentation, remote access, and network telemetry.

## Core knowledge
Network controls should enforce explicit communication requirements, limit blast radius, and avoid relying on IP location as identity. Security inspection must account for encryption, latency, failover, and operational ownership.

## Procedure
1. Map trust zones and required traffic flows.
2. Minimize exposed services and administrative paths.
3. Define segmentation boundaries around risk and business function.
4. Establish ingress and egress policy.
5. Select inspection and filtering points based on threat and performance needs.
6. Protect management planes separately from application traffic.
7. Design DNS and name-resolution security dependencies.
8. Add telemetry for allowed, denied, and unusual flows.
9. Validate failover and maintenance behavior.

## Decision points
Prefer allow-listed connectivity for sensitive zones. Use centralized controls for governance when they will not create unacceptable latency or single points of failure.

## Common failure patterns
Flat networks, undocumented firewall rules, unrestricted egress, shared administrative paths, and security appliances that become availability bottlenecks.

## Verification
Test expected flows, blocked flows, failover, logging, and reachability from representative trust zones.

## Expected output
A network security architecture with zones, permitted flows, enforcement points, monitoring, and resilience considerations.

## Stop conditions
Stop when dependency mapping is incomplete or a proposed control could interrupt critical traffic without a tested rollback path.