# Progressive Delivery and Traffic Ramping

## Purpose
Move an approved AI candidate from limited exposure to full production through evidence-driven traffic stages with bounded risk.

## When to use
Use after initial canary validation for releases that warrant gradual expansion.

## Inputs
Canary results, routing controls, promotion gates, traffic segments, SLOs, rollback criteria, capacity limits, and monitoring.

## Preconditions
Candidate-specific telemetry and rapid rollback are working.

## Context to inspect
Inspect regional/tenant distribution, peak periods, capacity, cache warm-up, dependency quotas, experiment interactions, and support readiness.

## Core knowledge
Risk is not linear with traffic percentage. New segments can introduce different languages, workloads, data sensitivity, or dependency behavior. Each ramp stage should add meaningful evidence.

## Procedure
1. Define staged exposure percentages or segment milestones.
2. Associate each stage with minimum observation time and gates.
3. Sequence low-risk, representative segments before high-risk cohorts.
4. Verify capacity before each increase.
5. Compare candidate and baseline on quality, safety, reliability, latency, and cost.
6. Review severe outliers, not only aggregate metrics.
7. Pause on ambiguous evidence rather than automatically ramping.
8. Roll back when abort criteria are met.
9. After full rollout, maintain heightened monitoring for a defined stabilization period.

## Decision points
Ramp by percentage for homogeneous traffic; ramp by region, tenant, or workflow when risk differs materially. Extend observation windows for low-frequency failures.

## Common failure patterns
Time-based automatic ramps without evidence, changing multiple variables mid-ramp, ignoring capacity headroom, and declaring completion immediately at 100% traffic.

## Verification
Audit each stage's gate evidence, routing state, observation duration, and approval. Confirm final production version and stabilization metrics.

## Expected output
A completed progressive-delivery record with stage evidence and final release status.

## Stop conditions
Stop ramping on failed gates, insufficient observation, capacity risk, telemetry ambiguity, or unresolved severe anomalies.
