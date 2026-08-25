# Network Resilience

## Purpose
Engineer edge communication to remain predictable across packet loss, high latency, asymmetric links, DNS failures, roaming, and intermittent connectivity.

## When to use
Use for any edge workload that depends on WAN, cellular, satellite, Wi-Fi, private radio, or unstable site networking.

## Inputs
Link types, outage patterns, latency budgets, bandwidth caps, retry requirements, dependency endpoints.

## Context to inspect
Inspect DNS, routing, proxies, firewalls, MTU, TLS, connection pools, retries, timeouts, health checks, and failover links.

## Core knowledge
Resilient networking requires bounded timeouts, exponential backoff with jitter, connection recovery, DNS tolerance, circuit breaking, link-awareness, and application-level offline behavior.

## Procedure
1. Measure real link latency, loss, and outage distributions.
2. Inventory external network dependencies.
3. Set explicit connection and request timeouts.
4. Implement bounded retries with jitter and idempotency.
5. Detect link state without trusting a single probe.
6. Define failover across available links when justified.
7. Prioritize critical traffic under constrained bandwidth.
8. Handle DNS and certificate failures explicitly.
9. Prevent reconnect storms after widespread outages.
10. Test degraded and flapping networks.

## Decision points
Use multi-link failover when availability value exceeds cost and complexity. Queue asynchronous work instead of extending synchronous timeouts when outages are expected.

## Common failure patterns
Infinite timeouts, synchronized retries, brittle DNS assumptions, treating ping success as service health, bandwidth starvation by bulk traffic.

## Verification
Inject latency, loss, DNS failure, route loss, link flapping, and reconnection storms; verify bounded recovery and critical-path availability.

## Expected output
A network resilience design with timeout, retry, prioritization, failover, and degraded-mode behavior.

## Stop conditions
Stop when upstream business operations require stronger connectivity guarantees than the available network can provide.