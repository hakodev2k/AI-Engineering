# Model Provider Resilience

## Purpose
Design and operate resilient AI services that tolerate model-provider degradation, quota pressure, regional outages, and behavioral incompatibilities.

## When to use
Use when depending on external model APIs, multiple model vendors, hosted inference, or internal serving clusters with distinct failure domains.

## Inputs
Provider SLAs, quotas, models, regions, request classes, fallback candidates, routing policy, latency/error telemetry, cost and compliance constraints.

## Preconditions
Critical workloads and minimum acceptable model capabilities are known.

## Context to inspect
Model gateway, timeouts, retries, circuit breakers, rate limits, regional routing, aliases, structured-output compatibility, safety behavior, data residency.

## Core knowledge
Fallback is not equivalent to resilience if alternate models violate context, tool-calling, safety, latency, or compliance requirements. Retries can amplify provider outages and consume quota.

## Procedure
1. Enumerate provider failure modes and dependencies.
2. Define per-request timeout and retry budgets.
3. Implement bounded retries with jitter only for retryable failures.
4. Add circuit breaking and health-aware routing.
5. Validate fallback models against critical contracts.
6. Segment high-risk workflows that must not fail over blindly.
7. Test regional and provider loss scenarios.
8. Monitor provider-specific saturation, errors, quality, and latency.
9. Define recovery thresholds and gradual traffic restoration.
10. Review provider concentration risk regularly.

## Decision points
Use failover only when capability and policy compatibility are proven. Prefer graceful degradation to unsafe substitution. Avoid cross-region routing that violates data constraints.

## Common failure patterns
Retry storms, global timeout values, hidden model alias changes, untested fallback prompts, restoring traffic too quickly, and assuming vendor status pages reflect tenant-specific failures.

## Verification
Synthetic probes, failover drills, and production metrics demonstrate bounded failure, correct fallback behavior, and successful recovery.

## Expected output
A provider resilience design with failure policy, fallback matrix, routing controls, tests, and recovery criteria.

## Stop conditions
Escalate when no compliant fallback exists or resilience requirements exceed contracted provider capabilities.