# Load Balancing and Edge Routing

## Purpose
Design resilient traffic distribution using ALB, NLB, Route 53, and CloudFront with correct health, TLS, and failover semantics.

## When to use
Use for public/private services, regional failover, TLS termination, edge acceleration, or load-balancer incidents.

## Inputs
Protocols, clients, latency target, health semantics, TLS requirements, source-IP needs, routing rules, multi-region design.

## Context to inspect
Listeners, target groups, health checks, certificates, Route 53 records, CloudFront origins/cache behavior, WAF, security groups, access logs.

## Core knowledge
ALB provides L7 routing; NLB provides high-performance L4 behavior and static-IP options. DNS failover is not instantaneous. Health checks must represent service readiness without depending on fragile downstreams.

## Procedure
1. Identify protocol and routing requirements.
2. Choose ALB, NLB, or CloudFront origin architecture.
3. Define TLS termination and certificate ownership.
4. Configure health checks with realistic thresholds.
5. Set connection idle/drain behavior to match applications.
6. Restrict origin access where possible.
7. Define DNS and multi-region failover rules.
8. Enable access logs and metrics.
9. Test unhealthy targets, AZ loss, certificate rotation, and failover timing.

## Decision points
Use ALB for HTTP-aware routing, NLB for TCP/UDP/TLS pass-through or very high throughput, CloudFront for global edge/caching/security benefits.

## Common failure patterns
Health checks that always return 200, DNS TTL assumptions, TLS mismatches, no draining, exposing origins directly, and forwarding all headers/cookies destroying cacheability.

## Verification
Run failover tests, validate TLS chains, confirm healthy/unhealthy transitions, and inspect access logs.

## Expected output
Traffic architecture, health model, TLS plan, and failure-test evidence.

## Stop conditions
Escalate when changes affect production DNS without rollback or when protocol requirements are incompatible with selected load balancer behavior.