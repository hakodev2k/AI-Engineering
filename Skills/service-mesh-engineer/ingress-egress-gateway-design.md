# Ingress and Egress Gateway Design

## Purpose
Design controlled north-south and outbound boundaries that integrate safely with east-west mesh traffic.

## When to use
Use for public ingress, partner connectivity, outbound allowlisting, TLS termination or gateway consolidation.

## Inputs
Domains, certificates, external dependencies, protocols, auth requirements, rate limits and network boundaries.

## Context to inspect
Cloud load balancers, ingress controllers, mesh gateways, DNS, firewall/NAT, egress policy and ownership.

## Core knowledge
Gateway, mesh and application authorization are separate layers. TLS may terminate or pass through depending on identity and inspection requirements. Egress control needs DNS and dynamic destination semantics considered explicitly.

## Procedure
1. Map inbound/outbound flows and trust transitions.
2. Assign responsibility for TLS, authentication and authorization.
3. Define listener, host and route ownership.
4. Apply least-privilege egress destinations.
5. Configure timeouts, limits and connection reuse.
6. Preserve client identity where required and trustworthy.
7. Test certificate rotation and destination failure.
8. Validate HA, scaling and failover.
9. Monitor gateway saturation and denied flows.

## Decision points
Centralize gateways for governance when blast radius is acceptable; decentralize when tenant isolation or independent lifecycle matters. Avoid egress gateways when simple network controls satisfy requirements.

## Common failure patterns
Double TLS termination confusion, trusting spoofable forwarding headers, unrestricted egress, gateway bottlenecks and wildcard host routing.

## Verification
Probe allowed/denied flows, inspect effective TLS identities, load test gateways and verify certificate rotation.

## Expected output
A boundary design with routing, trust, capacity and ownership documented.

## Stop conditions
Stop when certificate ownership, external dependency identity or network authority is unresolved.