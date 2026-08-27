# Multi-CDN Strategy

## Purpose
Design and operate multiple CDN providers when resilience, geography, capability, or commercial requirements justify the complexity.

## When to use
Use for critical global services, provider concentration risk, regional performance gaps, or contractual diversification.

## Inputs
Traffic regions, SLOs, provider capabilities, pricing, DNS/traffic steering, configuration portability, operational staffing.

## Context to inspect
Current CDN rules, certificates, logging, WAF, purge APIs, origins, DNS, deployment automation, incident history.

## Core knowledge
Multi-CDN can reduce provider dependency but duplicates control planes and introduces configuration drift, observability fragmentation, and failover complexity.

## Procedure
1. Define the concrete failure or performance problem multi-CDN addresses.
2. Identify minimum common behavior required across providers.
3. Separate portable policy from provider-specific optimizations.
4. Design steering and health signals with hysteresis.
5. Synchronize certificates, cache rules, WAF, and purge workflows.
6. Ensure origins can absorb shifted traffic.
7. Normalize telemetry for provider comparison.
8. Test partial and full traffic shifts regularly.
9. Document degraded-mode feature differences.

## Decision points
Use active-active for continuous validation and capacity readiness; active-passive reduces steady complexity but risks cold failover. Do not adopt multi-CDN when a single provider plus resilient origins meets risk objectives.

## Common failure patterns
Configuration drift, untested standby, DNS failover assumptions, origin overload after shift, incompatible cache keys, and inconsistent security rules.

## Verification
Perform controlled traffic shifts, compare correctness and SLOs, validate purge/security parity, and prove origin capacity.

## Expected output
A provider strategy, portable policy model, steering design, parity matrix, tests, and runbooks.

## Stop conditions
Stop if secondary capacity, security parity, or rollback cannot be demonstrated before production failover.