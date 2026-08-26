# Backup and Restore Engineering

## Purpose
Design PostgreSQL backups that satisfy recovery objectives and are proven restorable.

## When to use
Use for backup architecture, disaster-recovery readiness, migration safeguards, or restore incidents.

## Inputs
RPO/RTO, database size, topology, retention, encryption requirements, backup tooling, storage constraints.

## Context to inspect
Physical/logical backup strategy, WAL archiving, version compatibility, object storage, key management, restore history.

## Core knowledge
A successful backup is not evidence of recoverability. Physical backups plus WAL support point-in-time recovery; logical dumps provide object/data portability but different RPO/RTO characteristics.

## Procedure
1. Translate business requirements into RPO/RTO.
2. Inventory databases, roles, extensions and external dependencies.
3. Choose physical, logical, or combined strategy.
4. Configure retention, encryption and access controls.
5. Ensure WAL continuity for PITR when required.
6. Automate integrity/status checks.
7. Restore into isolated infrastructure regularly.
8. Validate data and application startup.
9. Measure actual restore duration.
10. Maintain a tested runbook.

## Decision points
Use physical backups for fast full-cluster recovery; logical backups for selective portability; combine when requirements demand both.

## Common failure patterns
Never testing restores, missing WAL, storing credentials with backups, ignoring roles/extensions, RTO based on assumptions.

## Verification
Perform timed restore drills and verify target recovery point, consistency, permissions, and application checks.

## Expected output
Backup policy, restore procedure, measured recovery evidence.

## Stop conditions
Escalate when required recovery objectives cannot be met with available storage, topology, or tooling.