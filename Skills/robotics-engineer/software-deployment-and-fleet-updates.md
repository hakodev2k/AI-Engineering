# Software Deployment and Fleet Updates

## Purpose
Deploy robot software and firmware safely with reproducible artifacts, compatibility checks, staged rollout, rollback, and post-update verification.

## When to use
Use for field releases, firmware changes, dependency upgrades, configuration migrations, or any change distributed to one or more robots.

## Inputs
Release artifacts, hardware variants, firmware/software compatibility matrix, configuration schema, rollout population, rollback constraints, acceptance tests.

## Preconditions
Artifacts are versioned and reproducible; recovery access and rollback paths are known.

## Context to inspect
Boot/update mechanism, partitions, package/container versions, firmware dependencies, calibration persistence, configuration migration, network reliability, battery/power constraints, fleet management.

## Core knowledge
Robot updates can leave physical systems unusable if power, networking, bootloaders, schema migrations, hardware variants, or calibration state are mishandled. Deployment must be transactional where possible and observable throughout.

## Procedure
1. Build immutable versioned artifacts and record provenance.
2. Define compatibility across hardware, firmware, software, and configuration.
3. Validate migrations and calibration preservation.
4. Run bench and representative hardware tests.
5. Define preflight checks for power, connectivity, storage, safety state, and recovery access.
6. Deploy to a canary population first.
7. Run automated post-update health, sensor, actuator, and mission checks.
8. Monitor failure indicators before expanding rollout.
9. Roll out in bounded waves with pause criteria.
10. Maintain tested rollback/recovery procedures and capture release evidence.

## Decision points
Use A/B or dual-partition strategies when interruption or bad images could brick the platform. Require manual approval when rollback is destructive or safety behavior changes.

## Common failure patterns
Unversioned configuration, incompatible firmware, calibration loss, updating on low battery, partial installs, no canary phase, rollback never tested, and declaring success after package installation without robot-level checks.

## Verification
Confirm artifact identity, boot success, configuration compatibility, sensor/actuator health, safety checks, representative mission behavior, and rollback on a test unit.

## Expected output
Release manifest, compatibility matrix, staged rollout plan, health gates, rollback procedure, and deployment evidence.

## Stop conditions
Pause rollout on unexplained canary failures, incompatible hardware, lost recovery access, migration uncertainty, or any safety regression.