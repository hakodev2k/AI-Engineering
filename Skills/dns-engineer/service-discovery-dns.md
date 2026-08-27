# Service Discovery DNS

## Purpose
Design DNS-based service discovery for dynamic workloads while controlling staleness, load, and failure semantics.

## When to use
Microservices, container platforms, dynamic infrastructure, SRV records, or discovery incidents.

## Inputs
Service registry, endpoint lifecycle, client resolver behavior, TTLs, health model, namespaces, orchestration platform.

## Context to inspect
A/AAAA/SRV generation, readiness/health, negative caching, client connection pooling, search paths, headless services, and stale endpoint cleanup.

## Core knowledge
DNS discovers endpoints but clients determine refresh behavior. Very low TTL does not guarantee rapid reconnection if applications cache independently.

## Procedure
1. Define service identity and namespace boundaries.
2. Determine endpoint registration/removal source of truth.
3. Select A/AAAA, SRV, or platform-native pattern.
4. Align publication with readiness semantics.
5. Set TTL from endpoint churn and query capacity.
6. Test client library caching behavior explicitly.
7. Handle zero-endpoint and partial-health states.
8. Validate negative caching and recovery.
9. Monitor stale records and query/error rates.
10. Test rolling deployment and endpoint failure.

## Decision points
Use DNS discovery when clients can tolerate cached endpoint sets; use richer service discovery/load balancing when metadata, rapid health reaction, or per-request policy is required.

## Common failure patterns
Publishing unready endpoints, clients caching forever, TTL too low for resolver capacity, stale records after crashes, search-domain ambiguity, and treating DNS as a health-aware load balancer.

## Verification
Observe registration, resolution, client refresh, endpoint removal, rolling deployment, and failure recovery.

## Expected output
Discovery contract, DNS record model, TTL/health policy, client compatibility evidence, and monitoring.

## Stop conditions
Stop when client caching cannot meet failover requirements or service-registry ownership/lifecycle is undefined.