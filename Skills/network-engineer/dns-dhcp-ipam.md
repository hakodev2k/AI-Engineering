# DNS, DHCP, and IPAM Operations

## Purpose
Operate core naming and address services reliably because failures here often appear as broad application or network outages.

## When to use
Use for DNS resolution incidents, DHCP exhaustion, IP conflicts, new zones/scopes, migrations, split-horizon design, or IPAM reconciliation.

## Inputs
Zones, records, resolver configuration, DHCP scopes/options, leases, IPAM inventory, forwarding rules, TTLs, and client symptoms.

## Context to inspect
Inspect authoritative and recursive DNS paths, delegation, caching, DNSSEC where used, DHCP relays, scope utilization, reservations, dynamic updates, and source-of-truth ownership.

## Core knowledge
DNS has layered caching and delegation; observed answers depend on resolver path and TTL. DHCP availability depends on relay reachability and pool capacity. IPAM should be authoritative enough to prevent unmanaged allocation.

## Procedure
1. Reproduce from the affected client/network.
2. Separate naming, routing, and application failures.
3. Trace DNS delegation/resolution or DHCP discover/offer path.
4. Check TTL, cache, zone, relay, scope, and lease state.
5. Compare live state with IPAM/source of truth.
6. Correct the smallest authoritative layer.
7. Account for cache propagation and lease lifecycle.
8. Monitor error and utilization trends.
9. Reconcile documentation and automation.

## Decision points
Use shorter TTLs during controlled migrations but avoid permanently low TTLs without need. Centralize IPAM governance while allowing automated allocation interfaces for scale.

## Common failure patterns
Editing non-authoritative DNS, stale records, exhausted scopes, missing relay configuration, duplicate static addresses, inconsistent split DNS, and ignoring negative caching.

## Verification
Test authoritative and recursive resolution, multiple client paths, lease acquisition/renewal, reverse records where required, and IPAM consistency.

## Expected output
Restored or designed naming/address services with validated records/scopes, ownership, and monitoring.

## Stop conditions
Stop when authoritative ownership is unknown, DNS changes affect public zones without approval, or address conflicts involve unmanaged critical systems.