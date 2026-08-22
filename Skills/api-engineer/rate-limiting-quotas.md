# Rate Limiting and Quotas

## Purpose
Protect API capacity and fairness while giving consumers predictable overload behavior.

## When to use
Use for public APIs, costly operations, abuse-prone endpoints, and shared multi-tenant capacity.

## Inputs
Traffic profiles, tenant tiers, capacity, abuse scenarios, latency objectives, and gateway capabilities.

## Context to inspect
Ingress architecture, identity keys, distributed counters, retry behavior, and monitoring.

## Core knowledge
Rate limits control request velocity; quotas control usage over longer windows. Limits should align with resource cost and identity, not merely IP address.

## Procedure
1. Measure normal and peak traffic.
2. Identify expensive or abuse-sensitive operations.
3. Choose limit key and algorithm.
4. Define burst and sustained thresholds.
5. Specify 429 behavior and Retry-After metadata.
6. Coordinate client retry guidance.
7. Instrument rejection rates and saturation.
8. Test distributed and failover behavior.
9. Review thresholds from production evidence.

## Decision points
Token bucket supports bursts; fixed windows are simpler but can create boundary spikes. Prefer per-consumer identity when available.

## Common failure patterns
Global one-size limits, retry storms, hidden limits, fail-open without analysis, and rate limiting after expensive work.

## Verification
Load tests prove limits activate as designed without harming compliant traffic.

## Expected output
An observable rate-limit and quota policy.

## Stop conditions
Escalate if capacity targets or business-tier policies are undefined.