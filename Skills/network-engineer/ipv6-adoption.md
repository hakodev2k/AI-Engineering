# IPv6 Adoption and Operations

## Purpose
Introduce and operate IPv6 safely alongside or beyond IPv4 with correct addressing, routing, DNS, security, observability, and application compatibility.

## When to use
Use for IPv6 programs, cloud/mobile requirements, address scarcity, dual-stack deployments, or IPv6-specific incidents.

## Inputs
Current IPv4 design, allocated IPv6 prefixes, ISP/cloud support, application inventory, DNS, security controls, device/client capabilities, and transition constraints.

## Context to inspect
Inspect RA/SLAAC/DHCPv6, prefix delegation, routing, DNS AAAA, firewall parity, VPN/load balancer support, monitoring, and whether clients prefer IPv6.

## Core knowledge
Dual stack creates two production networks; security and observability must cover both. IPv6 avoids NAT as an assumed security boundary and relies heavily on ICMPv6 for correct operation.

## Procedure
1. Inventory IPv6 capability across network and applications.
2. Obtain and hierarchically allocate address space.
3. Define router advertisement and address-assignment policy.
4. Establish routing and filtering.
5. Implement security-policy parity with IPv4.
6. Add DNS records only for validated services.
7. Preserve required ICMPv6 behavior.
8. Test dual-stack preference, PMTUD, VPN, and failover.
9. Monitor IPv6 paths independently.
10. Roll out incrementally and document exceptions.

## Decision points
Use dual stack for broad compatibility during transition; IPv6-only plus translation can simplify mature environments but requires application validation. Prefer stable hierarchical addressing over embedding unnecessary topology details.

## Common failure patterns
Publishing AAAA before service readiness, blocking ICMPv6, missing firewall rules, unmanaged SLAAC assumptions, IPv6 bypassing security inspection, and monitoring only IPv4.

## Verification
Test DNS, routing, security, application transactions, PMTUD, failover, and telemetry over IPv6 from representative clients.

## Expected output
A phased IPv6 architecture with addressing, routing, security, DNS, compatibility, and validation evidence.

## Stop conditions
Stop when security tooling lacks IPv6 support, allocated prefixes are uncertain, or critical applications fail without a safe fallback.