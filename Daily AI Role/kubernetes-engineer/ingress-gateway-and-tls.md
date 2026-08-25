# Ingress, Gateway, and TLS

## Purpose
Expose Kubernetes workloads safely with explicit routing, TLS, ownership, and failure behavior.

## When to use
Use when publishing HTTP/TCP services, migrating ingress controllers, introducing Gateway API, or debugging edge routing.

## Inputs
Hostnames, protocols, certificates, routing rules, backend Services, DNS, load-balancer requirements.

## Context to inspect
Inspect ingress/gateway controllers, classes, listeners, routes, certificate automation, DNS, health checks, proxy timeouts, and source-IP requirements.

## Core knowledge
Edge routing spans DNS, external load balancing, controller configuration, TLS termination, route matching, backend health, and application protocol behavior.

## Procedure
1. Define external contract and trust boundary.
2. Identify controller and supported API/version.
3. Configure listeners, hosts, paths, and backend references.
4. Define TLS issuance, renewal, and secret ownership.
5. Set timeouts/body limits only from workload needs.
6. Validate health checks and readiness semantics.
7. Test routing, redirects, headers, certificate chain, and failure cases.
8. Add metrics/logs and rollback path.

## Decision points
Use Gateway API when multi-team ownership and explicit infrastructure/application boundaries are valuable; retain mature Ingress where migration adds no material benefit.

## Common failure patterns
Catch-all routes, expired certificates, wrong TLS secret namespace, readiness mismatch, proxy timeout masking backend failures, and untrusted forwarded headers.

## Verification
Test from an external client, validate certificate hostname/chain, route precedence, backend failover, observability, and renewal automation.

## Expected output
A secure, testable edge-routing configuration with ownership and operational evidence.

## Stop conditions
Escalate when public DNS/certificate authority ownership is unavailable or routing changes risk production outage without staged rollout.