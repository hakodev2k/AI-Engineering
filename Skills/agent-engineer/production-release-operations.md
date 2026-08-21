# Production Release and Operations

## Purpose
Release and operate agent changes with controlled exposure, measurable quality, and fast rollback.

## When to use
Use for production changes to models, prompts, tools, retrieval, orchestration, memory, or policy.

## Inputs
Release artifact, evaluation results, SLOs, rollout platform, telemetry, rollback plan.

## Context to inspect
Current production version, dependencies, configuration, feature flags, dashboards, incident history, and compatibility constraints.

## Core knowledge
Agent behavior can change materially from small configuration changes. Treat prompts, model versions, tool schemas, and retrieval settings as versioned production artifacts.

## Procedure
1. Identify all behavior-affecting changes.
2. Run deterministic tests and behavioral evaluations.
3. Confirm security and privacy checks.
4. Version the deployable configuration.
5. Define rollout success and rollback thresholds.
6. Start with shadow, internal, or canary traffic when practical.
7. Compare quality, failure rate, latency, and cost against baseline.
8. Expand exposure gradually.
9. Roll back on critical regression.
10. Record release evidence and new production failure cases.

## Decision points
Use feature flags for independently reversible behavior. Prefer canaries for uncertain behavioral changes and immediate rollout only for low-risk well-tested fixes.

## Common failure patterns
Unversioned prompts, silent model upgrades, no baseline, monitoring only HTTP health, and rollback that cannot restore prior behavior.

## Verification
Prove the deployed version is identifiable, dashboards reflect task outcomes, thresholds are enforced, and rollback restores the previous known-good behavior.

## Expected output
A controlled release with version, evidence, rollout metrics, and rollback capability.

## Stop conditions
Stop rollout when critical evaluations fail or production behavior cannot be attributed to a known version.