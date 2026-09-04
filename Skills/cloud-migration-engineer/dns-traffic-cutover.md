# DNS and Traffic Cutover

## Purpose
Move client traffic to migrated workloads predictably while minimizing stale resolution, session disruption, and rollback delay.

## When to use
Use when migration changes IPs, endpoints, regions, load balancers, CDN origins, ingress, or service discovery.

## Inputs
DNS zones/records, TTLs, resolver behavior, load-balancer configuration, certificates, health checks, session model, client caching behavior, and rollback endpoints.

## Preconditions
Target endpoints must be healthy, certificates valid, and routing/security policies tested.

## Context to inspect
Inspect authoritative DNS, recursive resolvers, split-horizon zones, CNAME chains, CDN caches, application caches, service discovery, firewall allowlists, TLS names, and sticky sessions.

## Core knowledge
TTL is not a universal upper bound because clients and intermediaries may cache differently. Weighted routing and load balancers provide faster control than DNS alone when supported. Stateful sessions can make progressive traffic unsafe without compatibility.

## Procedure
1. Inventory every hostname and traffic entry point.
2. Identify hard-coded IPs and external allowlists.
3. Measure current DNS TTL and resolver behavior.
4. Lower TTL sufficiently ahead of cutover when DNS switching is required.
5. Validate target TLS, health checks, routing, and headers.
6. Confirm source and target can coexist for the intended transition.
7. Choose direct, weighted, canary, or blue/green traffic movement.
8. Define error/latency thresholds that pause or reverse traffic.
9. Shift a controlled portion of traffic where feasible.
10. Observe application, network, and business signals.
11. Complete traffic transition after gates pass.
12. Retain source route for rollback period.
13. Restore appropriate TTLs and remove temporary routes after stabilization.

## Decision points
Prefer load-balancer/weighted routing for rapid reversible changes. Use DNS-only cutover when architecture offers no closer traffic control. Avoid progressive routing when source/target state is incompatible.

## Common failure patterns
TTL changed minutes before cutover; missed secondary hostnames; certificate SAN mismatch; stale allowlists; health check too shallow; session incompatibility; no source route retained.

## Verification
Resolve from representative networks, validate TLS and headers, run user transactions, observe traffic distribution, and test reversal before final source retirement.

## Expected output
A traffic cutover plan with DNS/routing changes, thresholds, validation evidence, rollback steps, and cleanup actions.

## Stop conditions
Stop when target health is unstable, certificate or allowlist issues remain, state compatibility is uncertain, or rollback routing cannot be performed within recovery objectives.