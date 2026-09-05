# Provider and Region Routing

## Purpose
Route AI requests across providers and regions while respecting residency, availability, latency, capacity, contractual, and operational constraints.

## When to use
Use for multi-provider or multi-region AI platforms, disaster recovery, regional capacity management, or provider diversification.

## Inputs
Provider endpoints, regions, quotas, data-processing terms, latency measurements, residency requirements, model equivalence tests, and health signals.

## Preconditions
Each route must have an explicit data-handling and capability profile. Provider endpoints should be authenticated and monitored independently.

## Context to inspect
Network topology, regional gateways, provider agreements, model aliases, egress paths, failover rules, secrets, quotas, and health-check implementation.

## Core knowledge
Multi-provider routing is not interchangeable load balancing. Equivalent model names can differ by version, hosting configuration, safety controls, throughput, or retention policy. Regional routing must consider where prompts, retrieved context, logs, and outputs are processed and stored.

## Procedure
1. Enumerate providers and deployment regions.
2. Map legal and tenant residency constraints.
3. Validate model and API compatibility per endpoint.
4. Measure end-to-end regional latency.
5. Capture quotas and burst capacity.
6. Define health and degradation signals.
7. Establish primary and eligible alternate routes.
8. Test regional and provider failover with representative traffic.
9. Prevent routing loops and oscillation.
10. Audit route decisions with provider and region attribution.

## Decision points
Prefer the nearest eligible healthy region when quality is equivalent, but do not cross residency boundaries for latency. Diversify providers only when operational independence and compatibility justify added complexity.

## Common failure patterns
Assuming model equivalence across providers, routing sensitive data through disallowed regions, failover to exhausted quotas, and health checks that test transport but not inference behavior.

## Verification
Run synthetic probes from key regions, verify residency constraints under forced failover, and confirm route logs identify provider and region precisely.

## Expected output
A provider/region eligibility matrix, routing policy, tested failover paths, and audit controls.

## Stop conditions
Stop if residency or contractual obligations are ambiguous or if fallback endpoints have not passed compatibility and safety validation.