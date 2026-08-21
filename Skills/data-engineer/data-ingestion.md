# Data Ingestion

## Purpose
Ingest source data safely while preserving source meaning, traceability, and recoverability.

## When to use
Use for databases, APIs, files, SaaS exports, CDC feeds, object storage, and message sources entering a data platform.

## Inputs
Source contract, access method, rate limits, volume, change behavior, security classification, and destination landing rules.

## Context to inspect
Inspect source ownership, primary keys, timestamps, deletes, API pagination, encoding, time zones, rate limits, and historical correction behavior.

## Core knowledge
Landing data should preserve enough source fidelity to reprocess. Extraction must respect source load, incremental boundaries, pagination, deletion semantics, and auditability.

## Procedure
1. Profile the source and document assumptions.
2. Select snapshot, incremental, CDC, or event ingestion.
3. Define extraction boundaries and checkpoints.
4. Preserve source identifiers and ingestion metadata.
5. Handle pagination, throttling, transient failures, and partial files.
6. Capture deletes and corrections explicitly.
7. Validate counts, schema, and freshness before promotion.
8. Quarantine malformed records rather than silently dropping them.
9. Record lineage and source version.
10. Test restart and historical replay.

## Decision points
Use CDC when low-latency change capture and delete fidelity matter; use scheduled incremental extraction when operational simplicity is more valuable. Keep raw immutable copies when reprocessing or audit requirements justify storage.

## Common failure patterns
Offset pagination over changing datasets, local-time watermarks, missing deletes, silent truncation, source overload, and transformations that destroy raw evidence during ingestion.

## Verification
Reconcile source and landing counts, test boundary records, inspect duplicate and delete behavior, and rerun from a checkpoint without corruption.

## Expected output
A source-aware ingestion process with explicit checkpoints, validation, metadata, and recovery semantics.

## Stop conditions
Stop when source access risks production stability, credentials or data handling violate policy, or source semantics are too ambiguous for reliable extraction.