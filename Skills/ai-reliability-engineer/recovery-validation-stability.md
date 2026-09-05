# Recovery Validation and Stability

## Purpose
Verify that an AI system has genuinely recovered after mitigation, rollback, failover, or capacity restoration rather than merely showing a short-lived improvement.

## When to use
Use after incidents, provider recovery, rollback, failover, emergency scaling, queue drainage, index repair, or restoration from degraded mode.

## Inputs
Pre-incident baseline, SLOs, incident timeline, mitigation actions, current telemetry, backlog state, provider status, representative user journeys.

## Preconditions
The system is sufficiently contained to observe recovery safely.

## Context to inspect
Latency percentiles, error rates, saturation, queue age, model routing, quality/safety indicators, retrieval health, tool success, cost, autoscaling, regional state.

## Core knowledge
Recovery is a sustained state, not a single successful request. Hidden backlog, stale caches, uneven regional restoration, or degraded model routes can create a second incident after initial symptoms disappear.

## Procedure
1. Define measurable recovery criteria before declaring success.
2. Compare current metrics with pre-incident baseline and SLOs.
3. Confirm all regions, replicas, model routes, and dependencies are in intended state.
4. Verify queues are draining at a sustainable rate and old work is handled correctly.
5. Replay representative failing and healthy user journeys.
6. Check quality, safety, retrieval, and tool outcomes in addition to HTTP health.
7. Watch resource saturation and autoscaling as traffic normalizes.
8. Restore disabled features or traffic gradually.
9. Maintain an observation window appropriate to the incident pattern.
10. Record residual risk and follow-up actions.

## Decision points
Extend observation for intermittent, load-dependent, or provider-related failures. Restore high-risk autonomous capabilities last when confidence depends on several downstream components.

## Common failure patterns
Declaring recovery after p50 improves, ignoring backlog, restoring full traffic at once, missing one region, leaving an emergency fallback active indefinitely, and failing to compare with baseline.

## Verification
All recovery criteria remain satisfied through the observation window, representative journeys pass, queues and resource use stabilize, and configuration matches intended production state.

## Expected output
A recovery validation record with criteria, evidence, restored capabilities, residual risk, and final stability decision.

## Stop conditions
Return to active incident response if metrics regress, backlog grows, configuration is inconsistent, or user-impacting failures recur.