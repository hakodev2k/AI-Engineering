# Document Ingestion Pipeline

## Purpose
Build reliable ingestion that converts heterogeneous source material into traceable, indexable records.

## When to use
Use when onboarding sources or replacing fragile one-off ingestion scripts.

## Inputs
Source connectors, formats, update semantics, volume, parsing requirements, ACL metadata, destination schema.

## Context to inspect
Inspect source APIs, rate limits, change feeds, encoding, attachments, document IDs, deletion semantics, and existing ingestion checkpoints.

## Core knowledge
Production ingestion must be idempotent, resumable, observable, provenance-preserving, and deletion-aware. Parsing success is not equivalent to semantic correctness.

## Procedure
1. Define canonical document and version identities.
2. Select snapshot, incremental, or event-driven synchronization.
3. Extract raw content and metadata without destroying provenance.
4. Normalize encoding and structural metadata.
5. Detect unsupported, empty, duplicate, and corrupt inputs.
6. Propagate ACL and classification metadata.
7. Make writes idempotent and checkpoint progress.
8. Handle updates and tombstones explicitly.
9. Quarantine failures with actionable diagnostics.
10. Emit ingestion metrics and reconciliation counts.
11. Backfill safely with bounded concurrency.
12. Reconcile source and destination inventories.

## Decision points
Use incremental ingestion for large mutable corpora when reliable change signals exist; otherwise use periodic reconciliation. Preserve raw artifacts when reparsing is likely and policy permits.

## Common failure patterns
Duplicate documents after retries; silent parser truncation; no deletion handling; unstable IDs; ACL metadata dropped; full reindex required for every change.

## Verification
Reconcile counts, hashes or versions, sample parsed output, retry failed batches, and confirm update/deletion propagation.

## Expected output
A resumable ingestion pipeline with explicit data contracts and operational evidence.

## Stop conditions
Stop when source API semantics, authorization, or destructive synchronization behavior is uncertain.