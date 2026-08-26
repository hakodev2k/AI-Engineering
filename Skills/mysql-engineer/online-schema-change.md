# Online Schema Change

## Purpose
Evolve large MySQL schemas with controlled availability, replication, and rollback risk.

## When to use
Use for ALTER TABLE, index changes, type conversions, and constraints on production tables.

## Inputs
DDL, table size, write rate, replication topology, maintenance constraints, migration tooling.

## Context to inspect
MySQL version and supported ALGORITHM/LOCK behavior, free disk, replica lag, foreign keys, long transactions, deployment ordering.

## Core knowledge
DDL behavior varies by operation and version: instant, in-place, or table-copy paths have different locking/resource profiles. Application compatibility must span the deployment window.

## Procedure
1. Classify the change and compatibility requirements.
2. Determine native DDL algorithm/lock behavior.
3. Measure table size, write rate, disk headroom, and replica capacity.
4. Choose native online DDL or vetted online-schema-change tooling.
5. Make application changes backward/forward compatible.
6. Rehearse on production-like data.
7. Define throttling, abort thresholds, and rollback strategy.
8. Schedule and execute with monitoring.
9. Validate schema, data, replicas, and application behavior.
10. Remove transitional compatibility only after full verification.

## Decision points
Prefer native instant/in-place operations when safe. Use shadow-copy tooling when native DDL would block or copy prohibitively, accounting for triggers/FKs and replication load.

## Common failure patterns
Assuming ALTER is online, underestimating disk, ignoring long transactions, incompatible app rollout order, and no abort threshold.

## Verification
Verify DDL, row counts/checksums where appropriate, replica health, lock waits, error rate, and latency.

## Expected output
Migration runbook with compatibility sequence, risk controls, evidence, and rollback path.

## Stop conditions
Stop on unexpected blocking, dangerous replica lag, insufficient disk, checksum anomalies, or unreviewed destructive conversion.