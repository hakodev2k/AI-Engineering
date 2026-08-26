# DNS Resolver and Host Diagnostics

## Purpose
Diagnose Linux host name-resolution failures across application, libc/NSS, resolver, local cache, and upstream DNS layers.

## When to use
Use for slow lookups, intermittent resolution, split-DNS errors, search-domain surprises, or applications resolving differently from diagnostic tools.

## Inputs
Hostname, expected records, failing application, resolver configuration, network namespace, timestamps, and DNS architecture.

## Context to inspect
Inspect /etc/nsswitch.conf, resolv.conf ownership, systemd-resolved or local cache, search domains, VPN/container namespace, DNSSEC, upstream servers, and application-specific resolvers.

## Core knowledge
Applications may use libc/NSS, embedded resolvers, caches, or proxies. Search paths, ndots, TTL, negative caching, TCP fallback, and namespace-specific configuration can change outcomes.

## Procedure
1. Reproduce through the same resolution path as the application.
2. Inspect NSS and effective resolver configuration.
3. Identify local stub/cache and upstream servers.
4. Query exact FQDN and compare authoritative expectations.
5. Measure latency, retries, truncation, and server differences.
6. Check search-domain and namespace effects.
7. Inspect cache state and TTL behavior.
8. Correct the responsible layer, then retest application behavior.

## Decision points
Flush caches only when stale cache is proven or controlled testing requires it. Change search domains cautiously because they alter many implicit queries.

## Common failure patterns
Using dig alone to prove libc behavior, editing generated resolv.conf, ignoring VPN/container namespaces, confusing DNS with routing, and masking upstream faults with permanent hosts-file entries.

## Verification
Application and diagnostic paths return expected records within latency targets; failover and cache behavior are understood.

## Expected output
Resolution-path diagnosis, corrected configuration, and end-to-end verification.

## Stop conditions
Stop when authoritative DNS changes belong to another owner or cache manipulation would disrupt production without approval.