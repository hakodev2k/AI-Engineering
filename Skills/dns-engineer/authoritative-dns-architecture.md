# Authoritative DNS Architecture

## Purpose
Design resilient authoritative DNS that publishes correct zones with bounded failure domains and safe delegation.

## When to use
New domains, provider migration, multi-provider DNS, delegated subzones, or authoritative outages.

## Inputs
Zones, registrars, NS/DS records, traffic/availability targets, providers, DNSSEC policy, change ownership.

## Context to inspect
Delegation chain, SOA/NS, glue, hidden-primary/secondary topology, transfer/notify policy, anycast/provider dependencies, TTLs, and monitoring.

## Core knowledge
Authoritative DNS availability depends on delegation plus reachable consistent authorities. Separate registrar, registry, and zone-hosting responsibilities. Avoid correlated authorities.

## Procedure
1. Trace delegation from root/TLD to zone.
2. Inventory authoritative servers and failure dependencies.
3. Validate SOA serial strategy, NS/glue, transfers or provider synchronization.
4. Define TTLs from change and resilience needs.
5. Design provider/site diversity.
6. Restrict transfer/update permissions.
7. Plan DNSSEC signing if required.
8. Stage records and delegation changes in safe order.
9. Query every authority directly before cutover.
10. Monitor externally from multiple networks.

## Decision points
Use multi-provider DNS when independence justifies synchronization complexity. Use hidden primary when controlled publication and secondary diversity are valuable.

## Common failure patterns
Lame delegation, stale secondaries, missing glue, serial errors, correlated providers, premature old-NS removal, and inconsistent records.

## Verification
Confirm delegation, authoritative answers, SOA/NS consistency, transfer health, DNSSEC validation where used, and external reachability.

## Expected output
Authoritative topology, delegation/change plan, validated records, monitoring, and rollback.

## Stop conditions
Stop when registrar access is missing, zone ownership is unclear, DNSSEC chain changes are unapproved, or authorities disagree unexpectedly.