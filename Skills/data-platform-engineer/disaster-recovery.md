# Disaster Recovery

## Purpose
Design and prove recovery of data-platform control planes, metadata, state, and datasets after regional, account, operator, or corruption failures.

## When to use
Use for critical platforms, DR planning, architecture changes, or after recovery gaps are exposed by incidents.

## Inputs
RTO/RPO, asset inventory, backup policies, replication, dependencies, credentials, infrastructure definitions, and failure scenarios.

## Context to inspect
Backup scope, restore tests, cross-region/account copies, catalogs, orchestration state, secrets, keys, DNS/networking, and runbooks.

## Core knowledge
Replication is not backup: corruption and accidental deletion can replicate. Recovery requires dependencies, identities, keys, metadata, and configuration—not only data files. RTO must be measured by exercises.

## Procedure
1. Classify assets by criticality and recovery objectives.
2. Enumerate failure domains and correlated dependencies.
3. Identify authoritative backup for each stateful asset.
4. Separate backup credentials and failure domains where justified.
5. Define restoration order for infrastructure, identity, metadata, data, and workloads.
6. Automate reconstruction with IaC where possible.
7. Document key/secret recovery without embedding credentials.
8. Define data reconciliation after restore.
9. Run tabletop exercises, then technical restore drills.
10. Measure achieved RTO/RPO and remediate gaps.
11. Update procedures after architecture changes.

## Decision points
Use active-active only when RTO and business value justify complexity. Cold/warm standby is often sufficient. Immutable/versioned backups are valuable against corruption and malicious deletion.

## Common failure patterns
Untested backups, missing catalog metadata, keys unavailable during disaster, circular dependencies, backups in same failure domain, and runbooks requiring unavailable personnel.

## Verification
Restore into an isolated environment, validate dataset checksums/invariants and metadata, start representative workloads, measure recovery time, and reconcile to the declared recovery point.

## Expected output
DR architecture, backup matrix, restoration order, runbook, exercise evidence, and remediation backlog.

## Stop conditions
Escalate when no independent recoverable copy exists, cryptographic keys cannot be recovered, or a drill risks production data without isolation.