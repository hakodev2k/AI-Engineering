# Data Import and Bulk Loading

## Purpose
Load large datasets efficiently while preserving integrity, restartability, and production stability.

## When to use
Use for migrations, batch ingestion, historical backfills, partner imports, and large corrective updates.

## Inputs
Source format, row volume, schema, validation rules, target indexes/constraints, allowed maintenance window, and recovery requirements.

## Context to inspect
Inspect source quality, encoding, duplicate semantics, transaction-log capacity, indexes, constraints, triggers, replication, and concurrent production workload.

## Core knowledge
Bulk throughput depends on batching, logging, validation, index maintenance, network, and target contention. Fast ingestion is not success if rows are silently invalid or the process cannot resume.

## Procedure
1. Profile source volume, schema, nulls, duplicates, and malformed records.
2. Define deterministic validation and rejection rules.
3. Stage data when direct loading would mix validation with authoritative writes.
4. Choose engine-native bulk mechanisms where appropriate.
5. Batch work to bound locks, logs, memory, and retries.
6. Make imports idempotent or checkpointed.
7. Decide whether index/constraint changes are safe and beneficial.
8. Reconcile counts, keys, totals, and rejected records.
9. Monitor resource and replication impact during execution.
10. Retain an audit trail and cleanup procedure for staging artifacts.

## Decision points
Prefer staging for untrusted or transform-heavy sources. Direct bulk load is appropriate for trusted, validated data with simple semantics and controlled operational impact.

## Common failure patterns
One giant transaction, disabling constraints without revalidation, row-by-row inserts, no duplicate strategy, and reruns that create duplicate data.

## Verification
Reconcile source and target, validate constraints, sample business semantics, and measure resource impact.

## Expected output
A restartable bulk-load workflow with validation, reconciliation, and operational controls.

## Stop conditions
Stop when source semantics are ambiguous, destructive conflict resolution lacks approval, or capacity cannot safely support the load.