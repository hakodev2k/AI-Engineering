# Privacy and Data Lifecycle

## Purpose
Manage collection, retention, deletion, and reprocessing of embeddings and metadata in line with source-data privacy obligations.

## When to use
Use when storing personal/sensitive content, implementing erasure, retention, or model/data lifecycle changes.

## Inputs
Data classification, source retention policy, deletion requirements, tenant contracts, backup retention, and embedding provenance.

## Context to inspect
Inspect source fields embedded, metadata/payload copies, logs, caches, backups, replicas, exports, tombstones, and re-embedding pipelines.

## Core knowledge
Embeddings are derived representations, not automatic anonymization. Deletion must cover vectors, payloads, indexes, caches, replicas, and policy-governed backups. Data minimization reduces risk and operational burden.

## Procedure
1. Inventory source fields transformed or copied.
2. Minimize embedded and stored content to retrieval need.
3. Record provenance enabling targeted deletion/rebuild.
4. Define retention and expiry semantics.
5. Implement deterministic deletion by source identity/tenant.
6. Remove orphan chunks and derived copies.
7. Define backup deletion/expiry behavior consistent with policy.
8. Prevent sensitive payloads in telemetry/debug logs.
9. Test erasure end-to-end and verify absence after compaction/reindex where relevant.
10. Review new embedding/model workflows for changed data handling.

## Decision points
Store raw payload only when retrieval latency/availability benefits justify duplication; otherwise reference authoritative storage. Use tombstones only where policy permits retained markers.

## Common failure patterns
Assuming vectors cannot reveal source information; deleting source but not vectors; stale backups retained indefinitely; no mapping from source to chunks; sensitive metadata used unnecessarily; logs capturing queries/documents.

## Verification
Execute synthetic deletion requests, search all derived stores, verify lifecycle jobs and retention metrics, and review backup expiry evidence.

## Expected output
A documented lifecycle with minimization, provenance, retention, erasure, and verification controls.

## Stop conditions
Stop if legal/privacy policy is ambiguous or deletion testing risks real user data without authorization.