# OTA Update Strategy

## Purpose
Deliver firmware and configuration updates safely to remote fleets with rollback and progressive control.

## When to use
Use when building or reviewing over-the-air deployment mechanisms.

## Inputs
Firmware format, fleet topology, bandwidth, storage, bootloader behavior, release policy.

## Context to inspect
Current versions, update service, signing, partitions, health signals, connectivity, and field recovery options.

## Core knowledge
OTA is a distributed deployment problem under unreliable power and networks. Atomicity, authenticity, staged rollout, compatibility, health checks, and rollback matter more than transfer success alone.

## Procedure
1. Define supported upgrade paths and compatibility rules.
2. Sign and version artifacts.
3. Validate storage and atomic installation strategy.
4. Implement resumable download and integrity checks.
5. Deploy to test and canary cohorts.
6. Evaluate device health before expanding rollout.
7. Pause automatically on failure thresholds.
8. Support rollback or safe recovery.
9. Track fleet version convergence.

## Decision points
Use A/B partitions when bricking risk justifies storage cost; use delta updates when bandwidth savings outweigh added complexity.

## Common failure patterns
Fleet-wide rollout, no downgrade policy, power-loss corruption, incompatible config/schema changes, and success defined only as download completion.

## Verification
Test interruption at every update phase, bad signatures, insufficient storage, rollback, canary stopping, and mixed-version interoperability.

## Expected output
A resilient OTA lifecycle with measurable rollout safety.

## Stop conditions
Stop rollout when health regressions exceed thresholds or recovery cannot be guaranteed.