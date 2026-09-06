# Phased Rollout and Release Planning

## Purpose
Scale an AI capability from pilot to production using controlled cohorts, explicit gates, rollback options, and operational evidence.

## When to use
Use after a pilot meets predefined criteria and the next decision is how to expand access safely.

## Inputs
Pilot results, user segments, risk classification, support capacity, technical limits, training readiness, incident plan, and business priorities.

## Context to inspect
Inspect pilot failure modes, unresolved risks, model/provider quotas, support queues, telemetry, permissions, training completion, and dependency readiness.

## Core knowledge
AI rollout risk grows with user diversity, task diversity, and operational scale. A phased release should increase only one or a few dimensions of uncertainty at a time and preserve the ability to disable or narrow the capability quickly.

## Procedure
1. Define rollout goals and non-negotiable guardrails.
2. Segment users and workflows by risk and readiness.
3. Choose cohort sequence from lowest to highest uncertainty.
4. Define entry and exit criteria for each phase.
5. Confirm telemetry, alerting, support, and rollback mechanisms.
6. Set model/provider capacity and cost limits.
7. Complete required training and access provisioning.
8. Release to the first cohort and monitor defined metrics.
9. Review incidents, corrections, support demand, and value evidence.
10. Expand only when phase criteria are met.
11. Pause, narrow, or roll back when guardrails fail.

## Decision points
Use feature flags or scoped entitlements where possible. Expand by user cohort before high-risk task scope when user diversity is the main uncertainty; expand by task scope when workflow risk dominates.

## Common failure patterns
Big-bang launch after a small pilot, no rollback, scaling before support is ready, relaxing gates under schedule pressure, and changing multiple dependencies simultaneously.

## Verification
Run rollback drills, validate cohort boundaries, and prove each phase has measurable entry, exit, pause, and rollback criteria.

## Expected output
A phased rollout plan with cohorts, gates, monitoring, capacity, support, training, and rollback procedures.

## Stop conditions
Stop when rollback is unavailable, material pilot risks remain unowned, or support and monitoring cannot cover the next cohort.