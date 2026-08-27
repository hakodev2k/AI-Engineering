# Load Balancing and Application Delivery

## Purpose
Engineer L4/L7 traffic distribution with correct health, TLS, persistence, routing, and failure behavior.

## When to use
Use for new services, load-balancer migration, intermittent 5xx/timeouts, uneven backend load, or HA design.

## Inputs
Application protocol, VIPs, backend pools, health checks, TLS requirements, persistence needs, traffic volume, DNS, topology, and logs.

## Context to inspect
Listener policy, backend reachability, health state, connection reuse, TLS versions/certificates, SNAT, persistence, proxy headers, timeouts, and HA topology.

## Core knowledge
A load balancer changes connection topology. Diagnose client-to-VIP and balancer-to-backend legs separately. Health checks must represent service readiness without creating harmful load or false health.

## Procedure
1. Define client protocol, availability, and latency requirements.
2. Trace current connection path and source-address transformations.
3. Select L4 or L7 behavior based on required routing/inspection.
4. Define backend pool and capacity assumptions.
5. Create health checks that reflect dependency readiness appropriately.
6. Configure TLS termination/passthrough and certificate lifecycle.
7. Set timeouts from application behavior, not arbitrary long values.
8. Add persistence only when application state requires it.
9. Preserve client identity using supported mechanisms.
10. Validate SNAT/return routing and port capacity.
11. Test backend loss, balancer-node loss, and draining.
12. Monitor latency, errors, connections, and backend distribution.

## Decision points
Prefer stateless applications over persistence where architecture permits. Terminate TLS at the balancer for L7 capabilities when security requirements allow; use re-encryption for protected backend links.

## Common failure patterns
Shallow health checks, timeout mismatch, SNAT port exhaustion, stale persistence, certificate expiry, uneven hashing, missing client-IP handling, and asymmetric return paths.

## Verification
Confirm protocol behavior, TLS, health transitions, balanced load, client identity, failover, connection draining, and expected error/latency metrics.

## Expected output
Validated delivery configuration, health/TLS policy, capacity assumptions, failover evidence, and monitoring criteria.

## Stop conditions
Stop when application session semantics are unknown, certificate authority requirements are unresolved, or failover testing risks unapproved production impact.