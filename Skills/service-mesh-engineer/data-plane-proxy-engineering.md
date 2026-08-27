# Data Plane Proxy Engineering

## Purpose
Engineer and operate mesh data-plane proxies with predictable latency, resource use, protocol behavior and failure isolation.

## When to use
Use when configuring sidecars, node proxies, listeners, clusters, filters, connection pools or proxy runtime settings.

## Inputs
Proxy configuration, traffic profile, protocol mix, resource limits, latency SLOs, traces and proxy metrics.

## Context to inspect
Injection mechanism, bootstrap config, xDS state, listener/route/cluster dumps, kernel limits, pod resources and application connection behavior.

## Core knowledge
The proxy is in the request path. Queueing, retries, buffering, connection reuse, protocol translation and filter chains can amplify failures. Configuration correctness must be evaluated together with runtime resource constraints.

## Procedure
1. Establish baseline request latency and resource use without proposed changes.
2. Inspect active listeners, routes, clusters and endpoints.
3. Confirm protocol detection and upstream/downstream settings.
4. Size connection pools, keepalive, buffers and concurrency.
5. Minimize filter-chain work and unnecessary parsing.
6. Validate graceful drain and termination behavior.
7. Test overload, endpoint churn and control-plane loss.
8. Measure p50/p95/p99 latency, CPU, memory and connections.
9. Roll out incrementally with automatic rollback signals.

## Decision points
Use explicit protocol configuration when detection is ambiguous. Increase buffers or concurrency only from measurements; higher limits can trade latency for memory or increase downstream pressure.

## Common failure patterns
Proxy CPU throttling, connection storms, accidental HTTP/1 downgrade, excessive buffering, stale endpoints, unbounded retries and termination that drops in-flight requests.

## Verification
Compare before/after load tests, inspect proxy stats/config, exercise graceful shutdown and verify behavior during control-plane unavailability.

## Expected output
A measured proxy configuration with documented limits and rollout safeguards.

## Stop conditions
Stop when changes require unsafe production experimentation, unsupported filters, or SLO regressions without a clear mitigation.