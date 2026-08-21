# Data Retention, Archival, and Purge

## Purpose
Control database growth and meet legal or business retention rules through safe lifecycle management.

## When to use
Use for retention policies, oversized operational tables, privacy deletion, archival design, and storage-cost reduction.

## Inputs
Retention requirements, legal holds, data ownership, table relationships, access frequency, volume, archive platform, and recovery requirements.

## Context to inspect
Inspect foreign-key relationships, downstream consumers, backups, replicas, analytics pipelines, audit requirements, and current deletion behavior.

## Core knowledge
Retention is a data-governance workflow, not just DELETE statements. Purging must respect referential integrity, legal holds, downstream copies, performance, and recoverability.

## Procedure
1. Classify data by retention and deletion obligation.
2. Identify authoritative and derived copies.
3. Define archive eligibility and purge eligibility separately.
4. Map dependent rows and external consumers.
5. Choose archive format and retrieval expectations.
6. Purge in bounded, resumable batches or partition operations.
7. Control transaction log, locking, and replication impact.
8. Record deletion evidence without retaining prohibited content.
9. Reconcile downstream systems where required.
10. Monitor backlog and storage trend.

## Decision points
Archive only when future retrieval has value or obligation. Use partition-based lifecycle operations for very large time-oriented datasets when schema and access patterns support them.

## Common failure patterns
One huge delete transaction, ignoring backups and replicas, deleting parent rows before dependencies, indefinite archives with no owner, and confusing soft delete with regulatory erasure.

## Verification
Validate retained/removed populations, referential integrity, downstream propagation, archive readability, and workload impact.

## Expected output
A governed lifecycle process with retention rules, safe execution, evidence, and recovery considerations.

## Stop conditions
Escalate conflicting legal requirements, active holds, unclear data ownership, or destructive actions without approved policy.