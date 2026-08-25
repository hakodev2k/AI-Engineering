# OTA Deployment and Rollback

## Purpose
Deliver remote software and firmware updates safely across edge fleets with staged rollout, verification, and recoverable rollback.

## When to use
Use when designing or operating over-the-air updates for applications, containers, firmware, or system images.

## Inputs
Artifact types, fleet segmentation, bandwidth limits, maintenance windows, rollback constraints, signing model.

## Context to inspect
Inspect update agents, package sources, boot partitions, health checks, version inventory, connectivity patterns, and support procedures.

## Core knowledge
Senior OTA design requires immutable/versioned artifacts, authenticity verification, progressive rollout, atomic activation where possible, health-based rollback, bandwidth control, and fleet-state visibility.

## Procedure
1. Produce immutable versioned artifacts.
2. Sign and verify artifacts before activation.
3. Define compatibility and prerequisite checks.
4. Segment the fleet into canary and progressive rollout rings.
5. Download resumably and verify integrity.
6. Activate atomically or with a well-defined transaction boundary.
7. Run post-update health checks.
8. Roll back automatically when safe thresholds fail.
9. Pause rollout on correlated failures.
10. Reconcile final fleet versions and exceptions.

## Decision points
Prefer A/B or immutable image strategies when rollback reliability outweighs storage cost. Use in-place updates only when platform constraints require them and recovery is proven.

## Common failure patterns
Fleet-wide rollout, non-resumable downloads, unsigned artifacts, no rollback, incompatible dependency updates, false-positive health checks.

## Verification
Test interrupted downloads, power loss during activation, failed health checks, rollback, and mixed-version fleet operation.

## Expected output
A staged OTA process with trust, compatibility, health gates, rollback, and fleet reconciliation.

## Stop conditions
Stop if a failed update can irreversibly brick a significant fleet segment without an independent recovery channel.