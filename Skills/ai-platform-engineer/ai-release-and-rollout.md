# AI Release and Rollout

## Purpose
Provide a safe release mechanism for models, prompts, routing policies, retrieval components, and AI platform services with measurable rollback criteria.

## When to use
Use when promoting AI behavior changes to production, replacing providers, changing model aliases, or deploying platform components on the request path.

## Inputs
- Candidate artifact versions
- Evaluation evidence
- Production SLOs
- Rollback criteria
- Traffic segmentation capabilities

## Context to inspect
Inspect current deployment pipelines, artifact registries, feature flags, evaluation results, compatibility constraints, traffic routing, telemetry, and previous release incidents.

## Core knowledge
AI releases can regress quality without causing conventional errors. Rollouts should therefore monitor both infrastructure health and behavior metrics. Model, prompt, tool, and retrieval versions must be treated as a coherent release set when they interact.

## Procedure
1. Identify every behavior-affecting artifact in the release.
2. Confirm immutable versions and dependency compatibility.
3. Run required offline evaluations.
4. Define infrastructure and quality rollback thresholds.
5. Select canary population and traffic percentage.
6. Deploy without changing the control group.
7. Compare latency, errors, cost, safety, and task-quality indicators.
8. Investigate regressions before increasing traffic.
9. Progressively expand exposure.
10. Preserve instant rollback to the previous known-good release.
11. Record release metadata in telemetry.
12. Close the release only after an observation window appropriate to the workload.

## Decision points
Use shadow traffic when outputs need not affect users. Use canaries when online behavior is necessary. Prefer explicit version bundles when coupled artifacts cannot be validated independently.

## Common failure patterns
Big-bang model upgrades, no quality rollback metric, changing control traffic during comparison, alias updates with no traceability, and rollback that restores code but not prompts or model versions.

## Verification
Verify rollback, version telemetry, canary isolation, evaluation gates, and production comparison using a staged release before relying on the mechanism for critical systems.

## Expected output
A repeatable AI release workflow with gates, canaries, observability, version bundles, and rollback evidence.

## Stop conditions
Stop when no known-good rollback target exists, evaluation evidence is missing for high-impact changes, or traffic segmentation cannot protect critical users.