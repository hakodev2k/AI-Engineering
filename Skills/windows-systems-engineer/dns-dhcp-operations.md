# DNS and DHCP Operations

## Purpose
Operate Windows DNS and DHCP services reliably because addressing and name resolution are foundational dependencies for Windows estates and Active Directory.

## When to use
Use for DNS/DHCP incidents, scope design, record lifecycle, dynamic updates, failover, or service migration.

## Inputs
Zones, forwarding design, DHCP scopes/options, reservations, failover configuration, AD integration, update policy, and affected clients.

## Preconditions
Know authoritative ownership and replication model before modifying records or zones.

## Context to inspect
Zone type and replication scope, SOA/NS records, forwarders, scavenging, dynamic updates, DNS event logs, DHCP leases/scopes/options, exclusions, failover state, authorization, and client resolver configuration.

## Core knowledge
AD-integrated DNS replication differs from ordinary zone transfer. Negative caching, TTLs, stale records, conditional forwarding, secure dynamic updates, DHCP lease timing, and DHCP failover state all influence behavior.

## Procedure
1. Classify the issue as registration, authoritative lookup, recursive lookup, client caching, address allocation, or option delivery.
2. Query authoritative and client-facing DNS paths separately.
3. Inspect zone/record ownership, TTL, aging, and replication.
4. For DHCP, inspect scope utilization, lease state, exclusions, options, and failover health.
5. Compare working and failing subnets/clients.
6. Correct the authoritative configuration rather than repeatedly clearing clients.
7. Observe propagation, TTL, replication, or lease renewal effects.
8. Validate dependent AD and application workflows.
9. Record operational changes and capacity implications.

## Decision points
Use scavenging only with a deliberate aging design. Use reservations for stable address needs when static addressing is unnecessary. Prefer DHCP failover over improvised duplicate scopes.

## Common failure patterns
Deleting records without finding registration cause, stale static records that never age, conflicting DHCP servers, incorrect option inheritance, overly broad forwarders, and assuming immediate DNS propagation despite TTL/caching.

## Verification
Verify authoritative answers, recursive resolution, client registration, lease acquisition/renewal, failover state, scope capacity, and dependent service behavior.

## Expected output
Stable address assignment and name resolution with documented authoritative state.

## Stop conditions
Stop when zone ownership is uncertain, changes could affect forest-wide DNS, DHCP scope overlap is suspected, or failover recovery semantics are not understood.