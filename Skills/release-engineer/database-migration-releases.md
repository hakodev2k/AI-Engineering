# Database Migration Releases

## Purpose
Release schema and data changes without breaking mixed application versions, corrupting data, or creating unacceptable downtime.

## When to use
Use whenever a release changes persistent schemas, indexes, constraints, large datasets, or storage semantics.

## Inputs
Schema diff, application compatibility, data volume, query workload, migration tooling, replication topology, downtime budget, and recovery requirements.

## Preconditions
Migration behavior can be tested against representative schema and data volume.

## Context to inspect
Inspect locks, transaction behavior, long-running queries, replicas, ORM migrations, deployment order, old/new application versions, backups, and observability.

## Core knowledge
Prefer expand-and-contract: add backward-compatible structures, deploy code that tolerates both states, migrate data, switch usage, then remove old structures later. DDL cost and locking vary by database and version.

## Procedure
1. Classify schema and data changes by compatibility and operational risk.
2. Estimate lock, IO, log, and replication impact.
3. Split incompatible changes into expand/migrate/contract phases.
4. Make migrations idempotent or safely restartable where feasible.
5. Define batch size and throttling for data backfills.
6. Test with representative volume and concurrent workload.
7. Define monitoring and abort thresholds.
8. Deploy compatible application versions in correct order.
9. Validate data and query behavior after each phase.
10. Remove legacy structures only after rollback windows close.

## Decision points
Use online schema mechanisms when supported and justified. Prefer asynchronous backfill for large datasets. Accept planned downtime only when simpler and within agreed business constraints.

## Common failure patterns
Dropping/renaming columns before old code is gone, one huge transactional backfill, untested index creation, assuming ORM-generated migration is operationally safe, and rollback that cannot restore transformed data.

## Verification
Measure migration duration and locks, validate row counts/invariants, inspect replication lag, run old/new compatibility tests, and confirm application health.

## Expected output
A phased migration release plan with compatibility, monitoring, recovery, and completion criteria.

## Stop conditions
Stop when destructive changes lack backups or recovery, production-scale impact is unknown for a high-risk operation, or mixed-version compatibility cannot be guaranteed during rollout.