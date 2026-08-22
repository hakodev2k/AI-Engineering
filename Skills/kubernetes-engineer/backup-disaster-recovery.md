# Backup and Disaster Recovery

## Purpose
Design and prove recovery of Kubernetes application state, configuration, and dependent data after severe failure.

## When to use
Production readiness, RPO/RTO definition, backup redesign, or disaster exercises.

## Inputs
Critical workloads, state stores, RPO/RTO, regions, dependencies, credentials, and compliance needs.

## Context to inspect
Persistent data, external databases, cluster resources, GitOps state, secret systems, snapshots, backup tooling, and restore dependencies.

## Core knowledge
Backing up cluster objects is not equivalent to backing up application data. Recovery order and external dependencies matter; untested backups are assumptions.

## Procedure
1. Inventory state and sources of truth.
2. Assign RPO/RTO per service.
3. Define backup scope, frequency, retention, and encryption.
4. Separate backup failure domain from primary infrastructure.
5. Document dependency-aware restore order.
6. Restore into an isolated clean environment.
7. Validate data consistency and application behavior.
8. Measure actual recovery time and close gaps.

## Decision points
Recreate declarative resources from Git where reliable; back up irreplaceable state and metadata not reproducible elsewhere.

## Common failure patterns
Backing up PVCs only, same-region backup dependency, missing secrets, no restore tests, and unrealistic RTO.

## Verification
A timed recovery exercise meets RPO/RTO and validates business-level data correctness.

## Expected output
Tested DR runbook, evidence, ownership, and recovery metrics.

## Stop conditions
Escalate when required recovery objectives are impossible with current architecture.