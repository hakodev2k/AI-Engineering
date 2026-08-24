# CI/CD and Release Safety

## Purpose
Design backend delivery gates and rollout practices that make changes repeatable, observable, and reversible.

## When to use
Use when building pipelines, improving release reliability, or addressing deployment regressions.

## Inputs
Build/test process, environments, deployment platform, migration needs, risk profile, rollback capabilities.

## Context to inspect
Pipeline stages, artifact provenance, test gates, config promotion, migrations, feature flags, rollout strategy, and deployment telemetry.

## Core knowledge
Immutable artifacts, reproducible builds, progressive delivery, backward compatibility, expand-contract migrations, feature flags, rollback vs roll-forward, and supply-chain controls.

## Procedure
1. Build once and promote the same artifact.
2. Run fast deterministic quality/security gates early.
3. Separate deployment from feature exposure when useful.
4. Make schema changes backward compatible across rollout windows.
5. Define health signals and abort thresholds.
6. Use canary/progressive rollout for meaningful risk.
7. Automate rollback or roll-forward criteria where safe.
8. Preserve release metadata for correlation.
9. Rehearse failure and recovery paths.

## Decision points
Rollback code when state remains compatible; roll forward when irreversible data changes make rollback unsafe. Use feature flags for risky behavior, not permanent configuration clutter.

## Common failure patterns
Rebuilding per environment, destructive migrations before compatible code, manual undocumented steps, no rollback criteria, and declaring success when deployment completed but service health degraded.

## Verification
Demonstrate reproducible artifacts, successful staged rollout, health-based detection, and recovery from a deliberately failed release.

## Expected output
A release path with explicit gates, rollout, observability, and recovery.

## Stop conditions
Stop production release when rollback/forward recovery is undefined for a high-impact change.