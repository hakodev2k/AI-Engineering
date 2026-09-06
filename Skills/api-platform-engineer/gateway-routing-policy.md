# Gateway Routing Policy

## Purpose
Design safe, predictable API gateway routing and traffic policy across services and environments.

## When to use
Use when adding routes, consolidating ingress, introducing weighted routing, or diagnosing gateway behavior.

## Inputs
Route inventory, upstream endpoints, DNS/service discovery, traffic requirements, deployment topology.

## Context to inspect
Inspect route precedence, rewrites, headers, timeouts, health checks, TLS termination, and existing ownership rules.

## Core knowledge
Routing policy is production control-plane logic. Ambiguous matching, hidden rewrites, and global defaults can create large blast radii.

## Procedure
1. Map external routes to authoritative upstream owners.
2. Define deterministic match precedence.
3. Normalize path and host handling.
4. Set explicit upstream connection and request timeouts.
5. Configure health-aware routing.
6. Define header forwarding and trusted proxy behavior.
7. Isolate environment and tenant boundaries.
8. Add weighted/canary routes only with rollback controls.
9. Validate configuration before deployment.
10. Observe route-level errors and latency after change.

## Decision points
Use gateway routing for transport concerns; keep domain routing decisions in application services. Prefer service discovery over static endpoints where infrastructure supports it.

## Common failure patterns
Shadowed routes, unsafe wildcard matching, retry amplification, stale upstreams, incorrect forwarded headers, and route changes without rollback.

## Verification
Run route-table validation, synthetic requests, negative tests, upstream health tests, and post-deployment telemetry checks.

## Expected output
Deterministic gateway routing with documented ownership and rollback behavior.

## Stop conditions
Stop when upstream ownership, trust boundaries, or rollback mechanisms are unclear.