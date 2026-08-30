# Cloud Load Balancing and Edge

## Purpose
Design resilient internet and internal traffic entry using Google Cloud Load Balancing, Cloud CDN, Cloud Armor, health checks, and managed certificates.

## When to use
Use for global services, regional failover, private service front doors, CDN adoption, or edge security improvements.

## Inputs
Protocols, domains, traffic geography, backends, TLS requirements, availability targets, caching needs, and abuse risks.

## Context to inspect
Forwarding rules, proxies, URL maps, backend services, health checks, NEGs, certificates, Armor policies, and CDN configuration.

## Core knowledge
GCP offers global and regional load balancers with different backend and routing semantics. Health checks determine serving state; CDN and Armor operate at distinct stages in the request path.

## Procedure
1. Define protocol and availability requirements.
2. Choose global or regional load-balancer family.
3. Model backend groups or NEGs.
4. Configure health checks based on real readiness.
5. Define host/path routing.
6. Configure TLS and certificate automation.
7. Add Cloud Armor protections where relevant.
8. Enable CDN only for cache-safe content.
9. Test failover and unhealthy-backend behavior.
10. Monitor latency, errors, and backend saturation.

## Decision points
Use global external application load balancing for globally distributed HTTP workloads; choose regional or internal variants when locality or private routing is required.

## Common failure patterns
Weak health checks, caching personalized responses, no connection draining, oversized timeouts, and missing edge observability.

## Verification
Test route selection, certificate renewal, cache behavior, failover, and policy enforcement.

## Expected output
A secure, observable traffic-entry architecture.

## Stop conditions
Stop when domain ownership, TLS policy, or backend readiness semantics are undefined.