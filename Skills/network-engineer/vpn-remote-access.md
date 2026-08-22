# VPN and Remote Access

## Purpose
Provide secure remote or site connectivity with controlled identity, routing, encryption, and failure behavior.

## When to use
Use for site-to-site VPNs, workforce remote access, partner tunnels, cloud connectivity, certificate changes, or tunnel instability.

## Inputs
Peers, networks, identities, authentication method, encryption requirements, routing model, expected traffic, HA needs, and compliance constraints.

## Context to inspect
Inspect IKE/IPsec parameters, certificates/PSKs, route exchange, NAT traversal, split/full tunnel behavior, DNS, MFA, device posture, and logs.

## Core knowledge
Tunnel establishment does not prove application reachability. Encryption domains, routes, NAT, MTU, and policy must align on both sides. Remote access should minimize implicit trust after connection.

## Procedure
1. Define authorized users/sites and required destinations.
2. Choose authentication and key-management model.
3. Define encryption and lifetime parameters.
4. Design routing and overlapping-network handling.
5. Configure least-privilege policy.
6. Validate DNS and MTU/MSS behavior.
7. Design redundancy and rekey behavior.
8. Test tunnel establishment and representative traffic.
9. Monitor authentication, tunnel state, and packet drops.
10. Document renewal and incident procedures.

## Decision points
Prefer certificate/identity-based authentication over shared secrets where practical. Use split tunnel when security and endpoint controls permit; full tunnel centralizes inspection but increases capacity and latency demands.

## Common failure patterns
Mismatched proposals, overlapping CIDRs, tunnel-up/traffic-down states, expired certificates, broad remote access, MTU blackholes, and single concentrator dependencies.

## Verification
Test authentication, allowed/denied resources, failover, rekey, DNS, MTU-sensitive traffic, logging, and revocation.

## Expected output
A secure VPN/remote-access design with tested routing, policy, identity, resilience, and lifecycle procedures.

## Stop conditions
Stop if peer parameters cannot be coordinated, identity requirements are insufficient, or requested access violates segmentation policy.