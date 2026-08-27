# Cloud DNS and Service Resolution

## Purpose
Engineer reliable, secure DNS resolution across cloud, hybrid, private, and multi-region environments.

## When to use
Use for private zones, split-horizon DNS, hybrid forwarding, service discovery, migrations, resolution incidents, or DNS resilience reviews.

## Inputs
Namespaces, authoritative zones, resolver topology, forwarding rules, VPC/VNet associations, TTLs, service endpoints, hybrid links, and availability requirements.

## Preconditions
Identify authoritative ownership for every relevant namespace and capture actual resolver paths.

## Context to inspect
Private/public zones, resolver endpoints, conditional forwarders, search domains, caching behavior, DNSSEC where used, health-based records, and application resolver configuration.

## Core knowledge
DNS failures often present as application/network failures. TTL controls convergence versus query load; split-horizon designs can create inconsistent answers; forwarding loops and overlapping private zones are common hybrid hazards.

## Procedure
1. Map query paths from each client domain to authority.
2. Identify public/private namespace overlaps.
3. Define zone ownership and delegation.
4. Configure forwarding only where authority is clear.
5. Select TTLs based on change/failover requirements.
6. Design resolver redundancy across failure domains.
7. Protect recursive resolvers and zone changes.
8. Instrument query errors, latency, and resolver health.
9. Test positive, negative, cross-network, and failover resolution.
10. Document operational procedures and rollback.

## Decision points
Use private hosted zones for cloud-private names; use resolver forwarding for hybrid authority boundaries. Prefer explicit delegation over broad forwarding when organizational ownership supports it.

## Common failure patterns
Forwarding loops, stale caches during cutovers, private zones shadowing public names, single resolver endpoints, excessive low TTLs, and treating successful DNS as proof of service reachability.

## Verification
Query from representative networks, confirm expected authority/answers/TTLs, test resolver failure, inspect error rates, and validate that unauthorized networks cannot resolve restricted namespaces when that is required.

## Expected output
A resolver/authority map, DNS configuration, test evidence, monitoring, and change/runbook guidance.

## Stop conditions
Stop when namespace ownership is disputed, a DNS change risks broad outage without rollback, or hybrid resolver behavior cannot be observed.