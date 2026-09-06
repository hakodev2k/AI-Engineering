# DNS Reliability and Troubleshooting

## Purpose
Design, operate, and troubleshoot DNS so name resolution remains correct, observable, and resilient under dependency or provider failure.

## When to use
Use for intermittent resolution failures, stale records, failover design, split-horizon DNS, migration, or high-impact DNS incidents.

## Inputs
Zones, records, TTLs, resolvers, delegation, DNSSEC status, query logs, health checks, and dependency maps.

## Context to inspect
Inspect authoritative servers, recursive resolvers, caching layers, delegation chains, private/public views, search domains, and application retry behavior.

## Core knowledge
DNS failures amplify quickly because of caching and dependency fan-out. TTL, negative caching, delegation, resolver behavior, and health-based answers materially affect recovery.

## Procedure
1. Reproduce resolution from affected networks.
2. Trace delegation from root to authoritative answer.
3. Compare answers across resolvers and views.
4. Inspect TTL and negative-cache behavior.
5. Validate record ownership and health-check semantics.
6. Check DNSSEC and delegation consistency where used.
7. Evaluate resolver redundancy and forwarding chains.
8. Apply minimal changes and account for cache propagation.
9. Document recovery timing expectations.

## Decision points
Use shorter TTLs for planned migrations or dynamic failover, balanced against resolver load and cache efficiency. Use split-horizon DNS only with clear ownership and test coverage.

## Common failure patterns
Orphaned delegations, stale caches, circular forwarding, inconsistent private/public zones, excessively long TTLs, and health checks that do not reflect service viability.

## Verification
Query authoritative and recursive paths, validate from multiple network locations, and confirm expiration and failover behavior.

## Expected output
A verified DNS diagnosis or reliability design with recovery characteristics understood.

## Stop conditions
Escalate when delegation changes affect externally owned domains or DNSSEC changes could cause broad validation failure.