# Routing and Service Discovery

## Purpose
Design deterministic, observable routing from external API requests to healthy backend services.

## When to use
Use when adding routes, changing host/path rules, integrating discovery, or diagnosing misrouted traffic.

## Inputs
Route requirements, backend identities, discovery mechanism, health model, protocol constraints.

## Context to inspect
Existing route precedence, wildcard rules, DNS/service registry behavior, health checks, retries, and deployment topology.

## Core knowledge
Understand host/path/method/header routing, precedence, service discovery, endpoint health, connection reuse, load balancing, and stale endpoint risks.

## Procedure
1. Enumerate route matches from most specific to least specific.
2. Define backend service identities independently of instance addresses.
3. Integrate discovery with bounded cache freshness.
4. Configure active/passive health signals as appropriate.
5. Define load-balancing behavior and locality preferences.
6. Prevent ambiguous overlaps and shadowed routes.
7. Add route-level metrics and diagnostic metadata.
8. Test endpoint churn and unhealthy-backend removal.

## Decision points
Static endpoints fit stable small systems; dynamic discovery fits elastic fleets. Prefer local-zone routing when latency matters, but preserve cross-zone failover.

## Common failure patterns
Overlapping wildcards, stale discovery caches, routing by unstable instance identity, health checks that do not reflect readiness, uneven load distribution.

## Verification
Test all route matches, negative cases, endpoint rotation, failure removal, and traffic distribution.

## Expected output
Validated routing rules and discovery behavior with clear precedence and failover semantics.

## Stop conditions
Escalate if backend identity or readiness semantics are not defined.