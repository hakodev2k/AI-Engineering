# Storage Upgrades and Change Management

## Purpose
Execute firmware, software, controller, protocol, and configuration changes without compromising data availability, compatibility, or recovery.

## When to use
Use for planned upgrades, security patches, controller replacements, feature enablement, or fleet configuration changes.

## Inputs
Release notes, compatibility matrix, topology, maintenance window, SLOs, backups, rollback options, and vendor guidance.

## Preconditions
Confirm healthy redundancy, recent recoverability evidence, and supported upgrade paths.

## Context to inspect
Cluster health, replication, device firmware, host drivers, multipath, filesystems, client versions, network dependencies, known issues, and current alerts.

## Core knowledge
Storage changes can expose latent redundancy failures. Rolling upgrades require version interoperability and quorum awareness. Rollback may be impossible after on-disk format changes.

## Procedure
1. Define change scope and business risk.
2. Review release notes and compatibility.
3. Confirm backup/recovery and healthy redundancy.
4. Rehearse in a representative environment.
5. Define prechecks, success criteria, and abort thresholds.
6. Upgrade one failure domain/canary first where supported.
7. Observe client and backend health.
8. Continue in bounded stages.
9. Run postchecks and workload validation.
10. Record versions, anomalies, and rollback status.

## Decision points
Use rolling upgrades when interoperability is documented and capacity tolerates degraded members; use downtime when correctness cannot be guaranteed online.

## Common failure patterns
Upgrading unhealthy clusters, unsupported version jumps, changing all replicas together, no rollback understanding, ignoring client compatibility, and proceeding through warning signals.

## Verification
All nodes report intended versions, redundancy is restored, application SLOs and integrity checks pass, and alerts remain stable.

## Expected output
An approved change plan, staged execution record, verification evidence, and updated inventory/runbooks.

## Stop conditions
Abort on unexpected data errors, redundancy loss beyond policy, incompatible clients, failed canary, or irreversible change without required approval.
