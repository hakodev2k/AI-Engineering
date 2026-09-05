# Canary and Progressive Delivery

## Purpose
Reduce reliability risk from model, prompt, retrieval, tool, and application changes by exposing them gradually and measuring real outcomes before broad rollout.

## When to use
Use for production releases that can alter AI behavior, latency, cost, safety, or dependency load.

## Inputs
Release artifact, baseline version, traffic segmentation, SLOs, quality/safety metrics, rollback controls, experiment duration.

## Preconditions
Old and new versions can be identified in telemetry and rollback is tested.

## Context to inspect
Deployment system, model aliases, prompt registry, feature flags, routing, caches, schema compatibility, dashboards.

## Core knowledge
AI releases may regress only on certain intents or user segments. Progressive delivery needs both operational and behavioral guardrails; aggregate HTTP health alone is insufficient.

## Procedure
1. Define release hypothesis and explicit rollback thresholds.
2. Identify affected components and compatibility constraints.
3. Select a representative low-risk canary cohort.
4. Deploy with version-tagged telemetry.
5. Compare latency, errors, quality, safety, tool success, retrieval behavior, and cost against baseline.
6. Hold long enough to observe representative traffic.
7. Expand traffic in controlled stages only when gates pass.
8. Pause automatically or manually on guardrail breach.
9. Roll back cleanly if thresholds fail.
10. Record final evidence and release decision.

## Decision points
Use shadow traffic when outputs can be compared without affecting users. Use stricter gates for irreversible tool actions and high-risk domains.

## Common failure patterns
Canarying only application code while model aliases change globally, insufficient sample coverage, no behavioral metrics, stale caches, and rollback that restores only part of the version set.

## Verification
Telemetry proves the intended cohort received the new version, all guardrails remained within bounds, and rollback was tested or recently validated.

## Expected output
A progressive rollout plan, guardrail metrics, stage decisions, and release evidence.

## Stop conditions
Stop expansion on unexplained regression, missing telemetry, rollback uncertainty, or safety/security signal deterioration.