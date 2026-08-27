# Split-Horizon and Private DNS

## Purpose
Design private and split-view DNS without inconsistent answers, hidden dependencies, or namespace collisions.

## When to use
Hybrid cloud, internal services, private endpoints, VPN users, mergers, or split-view resolution incidents.

## Inputs
Namespaces, client locations, resolver paths, private zones, cloud DNS links, forwarding rules, application dependencies.

## Context to inspect
Search domains, conditional forwarding, resolver views, private-zone associations, overlapping namespaces, authoritative ownership, and VPN behavior.

## Core knowledge
Split DNS creates context-dependent truth and therefore operational complexity. Prefer clear namespace ownership and deterministic resolver routing.

## Procedure
1. Map every namespace and authoritative source.
2. Map client classes to resolver paths.
3. Identify overlapping public/private names.
4. Define forwarding/view rules with explicit longest-match behavior.
5. Validate private-zone associations and network reachability.
6. Account for remote users and hybrid links.
7. Prevent forwarding loops.
8. Document expected answer by client location.
9. Test positive, negative, and failover cases.
10. Monitor resolver errors by view/network.

## Decision points
Use separate internal subdomains when organizational control permits; split-view same-name zones may be justified for application compatibility. Centralize forwarding when it improves governance without creating WAN dependency.

## Common failure patterns
Private zone shadowing public records, forwarding loops, missing cloud network links, VPN clients using wrong resolvers, inconsistent duplicate records, and NXDOMAIN from incomplete private zones.

## Verification
Query from each client class, trace forwarding, validate intended answer and NXDOMAIN behavior, and test resolver/link failure.

## Expected output
Namespace ownership map, forwarding/view configuration, client test matrix, and operational documentation.

## Stop conditions
Escalate when namespace ownership conflicts, merger overlaps are unresolved, or changing resolver paths risks broad outage without representative testing.