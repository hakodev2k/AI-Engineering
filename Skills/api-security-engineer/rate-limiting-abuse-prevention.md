# Rate Limiting and Abuse Prevention

## Purpose
Design controls that constrain automated abuse, enumeration, credential attacks, scraping, and excessive consumption without unnecessarily harming legitimate clients.

## When to use
Use for public APIs, authentication flows, expensive operations, search, exports, account recovery, third-party integrations, and endpoints with observed abuse.

## Inputs
Traffic baselines, caller identities, endpoint cost, business criticality, abuse scenarios, SLOs, quota requirements, gateway capabilities.

## Preconditions
Distinguish infrastructure protection, commercial quotas, fairness, and security abuse controls because they require different thresholds and responses.

## Context to inspect
Gateway limits, application counters, IP/client/user dimensions, distributed state, burst behavior, retry headers, queue depth, downstream bottlenecks, and bypass routes.

## Core knowledge
Effective limiting combines multiple dimensions and cost awareness. Per-IP controls alone fail behind NATs and botnets. Security-sensitive operations often need tighter identity- or action-based limits, progressive friction, and anomaly detection.

## Procedure
1. Identify abuse objectives and expensive operations.
2. Measure normal sustained and burst traffic.
3. Select limit dimensions such as identity, token, tenant, IP, operation, or resource.
4. Define burst and sustained thresholds.
5. Add weighted costs for expensive actions.
6. Choose local versus distributed enforcement.
7. Define safe rejection and Retry-After behavior.
8. Protect limit stores from becoming bottlenecks.
9. Test legitimate bursts, distributed attacks, and bypass paths.
10. Monitor saturation, denials, and false positives.

## Decision points
Use token bucket for controlled bursts, sliding/fixed windows when operational simplicity is more important, and concurrency limits for scarce resources. Apply progressive challenges or stronger verification when hard blocking creates unacceptable user impact.

## Common failure patterns
Single global limit, IP-only identity, trusting spoofable headers, unlimited expensive endpoints, fail-open limiters, synchronized retry storms, and thresholds chosen without production baselines.

## Verification
Load test normal and abusive patterns, confirm consistent enforcement across replicas, inspect downstream resource usage, and validate observability and retry semantics.

## Expected output
A measured rate-control design with dimensions, thresholds, bypass protections, tests, and operational dashboards.

## Stop conditions
Escalate when legitimate and abusive traffic cannot be distinguished with available signals, limits threaten critical workflows, or enforcement requires new authoritative identity data.