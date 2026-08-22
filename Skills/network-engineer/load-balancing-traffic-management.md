# Load Balancing and Traffic Management

## Purpose
Distribute traffic across healthy service instances while preserving availability, performance, security, and correct application behavior.

## When to use
Use for application publishing, scaling, failover, TLS termination, multi-region traffic, health-check incidents, or uneven backend load.

## Inputs
Application protocol, backend topology, health semantics, session behavior, TLS requirements, capacity, latency targets, and failure modes.

## Context to inspect
Inspect L4/L7 listeners, pools, health probes, DNS/GSLB, persistence, connection reuse, proxy headers, timeouts, certificates, and backend observability.

## Core knowledge
A health check should represent ability to serve meaningful traffic without causing dependency cascades. Load-balancer timeouts and retries interact with application and client behavior.

## Procedure
1. Map client-to-service traffic and protocol requirements.
2. Define listener, TLS, and backend behavior.
3. Design meaningful health checks.
4. Select balancing and persistence strategy.
5. Align connection, idle, and request timeouts.
6. Preserve client identity where required.
7. Model backend loss, zone loss, and overload.
8. Configure observability for frontend and backend states.
9. Test draining, failover, and recovery.

## Decision points
Use L7 when content-aware routing/security is required; L4 can reduce complexity and overhead. Avoid sticky sessions unless application state requires them; prefer externalized state for scalable services.

## Common failure patterns
Shallow health probes, retry storms, mismatched timeouts, broken source-IP assumptions, persistence hotspots, certificate expiry, and removing backends without connection draining.

## Verification
Test healthy distribution, failed backend removal, graceful drain, TLS, headers, latency, connection behavior, and recovery under representative load.

## Expected output
A validated traffic-management configuration with health, failover, capacity, TLS, and operational guidance.

## Stop conditions
Escalate when application health semantics are unknown, TLS ownership is unclear, or failover could corrupt state/session behavior.