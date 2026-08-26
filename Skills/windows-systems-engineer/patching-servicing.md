# Windows Patching and Servicing

## Purpose
Plan and execute Windows servicing with controlled risk, measurable compliance, and reliable rollback/recovery.

## When to use
Use for monthly updates, emergency security patches, feature upgrades, servicing-stack issues, or patch-failure investigation.

## Inputs
Asset inventory, criticality tiers, update source, maintenance windows, cluster/application dependencies, reboot policy, backups, and compliance targets.

## Preconditions
Confirm recovery and application validation procedures. Coordinate clustered or redundant workloads so availability is preserved.

## Context to inspect
OS/build, installed and pending updates, servicing stack, reboot state, Windows Update logs, component-store health, free disk, update policy, application support matrix, and recent failures.

## Core knowledge
Servicing changes kernel and system components and often requires reboot. Ring-based deployment limits blast radius. Patch success is not equivalent to workload health. Component-store corruption, policy, proxy, disk pressure, or supersedence can explain failures.

## Procedure
1. Classify update urgency and affected assets.
2. Review known compatibility constraints and prerequisites.
3. Establish pilot, early, and broad deployment rings.
4. Confirm backup/recovery and capacity.
5. Patch a representative pilot and reboot as required.
6. Validate OS, services, applications, monitoring, and security controls.
7. Expand rings based on evidence.
8. Investigate failures from logs/error codes before repeated retries.
9. Track compliance and exceptions.
10. Record post-deployment incidents and feed lessons into future rings.

## Decision points
Accelerate actively exploited security fixes but retain staged validation where possible. Roll back only when the update is causally linked and rollback risk is lower than remaining exposure.

## Common failure patterns
Patching every host simultaneously, no application validation, endless retry loops, ignoring pending reboots, insufficient disk, unsupported update deferrals, and reporting installation percentage as service health.

## Verification
Verify update/build state, reboot completion, service/application smoke tests, cluster redundancy, monitoring, and compliance reporting.

## Expected output
A patched estate with explicit success, exception, and failure evidence.

## Stop conditions
Stop for unavailable recovery, incompatible vendor guidance, quorum/availability risk, unexplained pilot regression, or destructive servicing repair requiring separate approval.