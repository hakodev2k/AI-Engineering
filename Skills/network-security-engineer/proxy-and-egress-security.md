# Proxy and Egress Security

## Purpose
Control outbound connectivity to reduce malware communication, data exfiltration, shadow services, and unmanaged internet access.

## When to use
Use for secure web gateways, explicit/transparent proxies, egress filtering, cloud workloads, or exfiltration investigations.

## Inputs
Outbound application requirements, identities, destinations, protocols, privacy constraints, proxy/firewall capabilities.

## Context to inspect
Default routes, NAT, proxies, DNS, direct internet paths, TLS inspection, service accounts, cloud egress gateways.

## Core knowledge
Default-deny egress, domain/IP volatility, proxy authentication, TLS inspection trade-offs, SNI/HTTP metadata, service dependencies.

## Procedure
1. Inventory outbound flows and owners.
2. Identify uncontrolled direct egress paths.
3. Classify destinations and protocols.
4. Route applicable traffic through managed controls.
5. Apply identity-aware policy where possible.
6. Restrict non-web egress separately.
7. Define inspection and privacy boundaries.
8. Monitor blocked and anomalous destinations.
9. Review exceptions periodically.

## Decision points
Use destination allowlists for tightly controlled workloads; category/risk-based policy for broad user browsing. Inspect TLS only with approved governance and technical compatibility.

## Common failure patterns
Proxy bypass, wildcard destination permits, IP allowlists for dynamic SaaS, breaking certificate-pinned apps, no non-HTTP egress controls.

## Verification
Test approved and prohibited destinations, direct bypass attempts, identity attribution, and application compatibility.

## Expected output
Egress architecture, policy, exception model, validation evidence, monitoring queries.

## Stop conditions
Escalate when business dependencies cannot be identified, inspection conflicts with policy, or enforcement risks critical external integrations.