# Release and Deployment Risk Management

## Purpose
Design releases so changes can be introduced, observed, and reversed with controlled blast radius.

## When to use
Use for high-risk releases, schema changes, infrastructure changes, and new critical workflows.

## Inputs
Change set, deployment pipeline, dependencies, migrations, telemetry, rollback capabilities, traffic profile.

## Context to inspect
Inspect backward compatibility, deployment ordering, database changes, feature flags, capacity, health checks, and incident history.

## Core knowledge
Deployment and release are different concerns. Progressive exposure, compatibility windows, and observability reduce risk more reliably than manual confidence.

## Procedure
1. Classify change risk and blast radius.
2. Identify irreversible operations.
3. Ensure old and new versions can coexist when rollout requires it.
4. Separate schema expansion from contraction.
5. Define health and business success signals.
6. Choose rollout strategy: direct, rolling, canary, blue-green, or feature flag.
7. Define rollback/roll-forward conditions.
8. Verify capacity and dependency readiness.
9. Observe rollout before increasing exposure.
10. Remove temporary flags and compatibility code after stability.

## Decision points
Use progressive rollout for uncertain or high-impact changes. Prefer roll-forward when rollback would violate data compatibility.

## Common failure patterns
Destructive migrations first, no rollback criteria, feature flags left forever, and judging health only by deployment success.

## Verification
Release signals remain healthy at each exposure stage and recovery procedures are tested or credibly executable.

## Expected output
A release plan with risk classification, sequencing, evidence gates, and recovery actions.

## Stop conditions
Stop rollout when critical telemetry is unavailable, compatibility assumptions fail, or rollback/roll-forward is unsafe.