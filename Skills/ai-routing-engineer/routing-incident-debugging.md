# Routing Incident Debugging

## Purpose
Diagnose production incidents where requests are routed to the wrong model, provider, region, capacity pool, fallback, or policy path.

## When to use
Use for quality regressions, unexpected cost spikes, latency anomalies, policy violations, route oscillation, provider imbalance, or incorrect fallback behavior.

## Inputs
Incident description, route traces, policy version, model/provider versions, request class, eligibility decisions, health signals, recent changes, and metrics.

## Preconditions
Preserve representative traces and current configuration before changing routing state.

## Context to inspect
Gateway deployment history, feature flags, model registry, tenant policy, classifier output, circuit breakers, quota state, experiment assignment, caches, and provider incidents.

## Core knowledge
Routing incidents are often caused by stale configuration, bad classification, health-signal lag, quota changes, provider alias drift, inconsistent rollout, or interacting fallback/retry layers. The final selected model is a symptom; investigation must reconstruct the full decision path.

## Procedure
1. Identify affected request classes, tenants, regions, and time window.
2. Reconstruct the route decision for failing examples.
3. Compare candidate eligibility with expected policy.
4. Check classifier output and confidence.
5. Check policy and registry versions on every gateway replica.
6. Inspect provider health, quota, breaker, and capacity signals at decision time.
7. Trace retries and fallback transitions.
8. Correlate the first divergence with recent changes.
9. Contain via rollback, route pinning, or safe-mode policy.
10. Reproduce the issue in replay or staging.
11. Add regression tests and observability gaps to follow-up actions.

## Decision points
Contain first when policy, privacy, safety, or major cost impact is ongoing. Prefer a known-good deterministic route while a learned or dynamic policy is under investigation.

## Common failure patterns
Looking only at final route, changing weights before preserving evidence, blaming provider latency without queue metrics, and ignoring inconsistent config propagation.

## Verification
Replay confirms the identified cause changes route behavior as predicted and the fix restores expected decisions across affected segments.

## Expected output
An incident timeline, causal diagnosis, containment, permanent fix, and regression evidence.

## Stop conditions
Escalate immediately for data residency, authorization, privacy, or safety violations, or when production changes require unavailable approval.