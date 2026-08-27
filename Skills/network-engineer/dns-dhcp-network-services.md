# DNS, DHCP, and Network Services

## Purpose
Operate foundational network services reliably and diagnose failures without confusing application symptoms with network transport failures.

## When to use
Use for name-resolution incidents, DHCP failures, service migrations, split-horizon DNS, or network bootstrap problems.

## Inputs
Queries, leases, scopes, zones, resolver/authoritative configuration, relay configuration, logs, packet captures, and topology.

## Context to inspect
Client resolver settings, search domains, DNS delegation, TTLs, caching, DNSSEC where used, DHCP pools/options, relay paths, HA/failover, and firewall policy.

## Core knowledge
Separate authoritative DNS, recursive resolution, caching, and client behavior. DHCP depends on broadcast/relay path and correct scope selection. TTLs affect both resilience and migration speed.

## Procedure
1. Reproduce from an affected client and a known-good control point.
2. For DNS, trace query from client to resolver and authoritative chain.
3. Inspect response code, answer, authority, TTL, and caching behavior.
4. Validate delegation and split-view policy.
5. For DHCP, inspect Discover/Offer/Request/Ack sequence or IPv6 equivalent.
6. Verify relay address, scope selection, pool capacity, options, and conflict detection.
7. Check firewall and routing between service components.
8. Compare server logs with packet evidence.
9. Apply scoped configuration changes.
10. Flush caches only when necessary and understand blast radius.
11. Validate HA/failover behavior.

## Decision points
Use shorter DNS TTLs around planned migrations, not permanently without reason. Centralize DHCP when relay and WAN reliability support it; retain local resilience where site isolation matters.

## Common failure patterns
Stale caches, broken delegation, inconsistent split DNS, exhausted pools, incorrect relay, duplicate DHCP servers, bad gateway/DNS options, and assuming ping failure means DNS failure.

## Verification
Resolve through intended chains, validate positive and negative responses, obtain/renew leases, confirm correct options, and test failover where supported.

## Expected output
Root cause or validated service change, query/lease evidence, configuration corrections, and monitoring recommendations.

## Stop conditions
Escalate when authoritative ownership is unclear, DNS changes affect public zones without approval, or lease/database repair risks widespread client disruption.