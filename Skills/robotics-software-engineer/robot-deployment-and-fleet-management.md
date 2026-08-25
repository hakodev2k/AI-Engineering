# Robot Deployment and Fleet Management

## Purpose
Deploy robotics software safely across one or many robots with version control, staged rollout, compatibility checks, rollback, and fleet observability.

## When to use
Use when packaging releases, updating field robots, coordinating firmware/software compatibility, or operating heterogeneous fleets.

## Inputs
- Release artifacts and dependencies
- Robot hardware revisions
- Firmware/configuration compatibility matrix
- Fleet inventory
- Rollout and rollback requirements
- Connectivity constraints

## Preconditions
Every deployable robot must have a known identity, current version state, and recoverable update path.

## Context to inspect
Inspect build artifacts, containers/packages, system services, launch configuration, environment variables, firmware, maps/models, dependency locks, update agents, and fleet telemetry.

## Core knowledge
Understand reproducible builds, artifact immutability, semantic compatibility, staged rollout, canaries, health gates, A/B partitions where available, configuration drift, offline updates, and rollback semantics.

## Procedure
1. Build immutable release artifacts with version and provenance metadata.
2. Define software, firmware, hardware, map/model, and configuration compatibility.
3. Validate installation and rollback on representative hardware.
4. Run simulation/HIL and physical acceptance gates.
5. Deploy first to test robots or canary population.
6. Monitor mission success, safety events, resource use, and subsystem health.
7. Expand rollout only after explicit health thresholds pass.
8. Pause automatically or operationally on regression signals.
9. Preserve previous known-good artifacts and configuration.
10. Reconcile fleet version drift after rollout.
11. Document field recovery for partially applied updates.

## Decision points
Use rolling updates for recoverable noncritical changes; maintenance windows when update interruption creates operational risk. Bundle firmware only when compatibility requires coordinated change. Prefer gradual rollout over fleet-wide updates even when CI is green.

## Common failure patterns
- Artifact rebuilt between environments
- Firmware/software incompatibility discovered in field
- Configuration changed outside version control
- No rollback for schema/map/model changes
- Fleet-wide deployment before canary evidence

## Verification
Verify artifact hashes, clean-install and rollback tests, canary health, fleet version inventory, and recovery from interrupted update scenarios.

## Expected output
A controlled deployment process with compatibility matrix, staged gates, rollback, fleet inventory, and recovery procedures.

## Stop conditions
Stop rollout when safety events increase, canary health fails, rollback is unavailable for a material risk, compatibility is uncertain, or fleet telemetry is insufficient to detect regressions.