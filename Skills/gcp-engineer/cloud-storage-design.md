# Cloud Storage Design

## Purpose
Design secure and cost-effective object storage using Cloud Storage buckets, lifecycle rules, retention controls, encryption, and access patterns.

## When to use
Use for data lakes, static assets, backups, archives, uploads, or cross-system object exchange.

## Inputs
Data classes, object size, access frequency, locality, retention, recovery, compliance, and throughput needs.

## Context to inspect
Bucket location, storage class, uniform access, IAM, public-access prevention, retention policy, lifecycle rules, versioning, and encryption configuration.

## Core knowledge
Bucket location is foundational and difficult to change. Storage class should follow measured access patterns. Uniform bucket-level access simplifies authorization and prevents ACL drift.

## Procedure
1. Classify data and residency requirements.
2. Choose region, dual-region, or multi-region.
3. Select storage class from access pattern.
4. Enable uniform bucket-level access.
5. Apply public-access prevention unless explicitly required.
6. Configure lifecycle and retention controls.
7. Decide versioning strategy.
8. Configure CMEK only when key-control requirements justify it.
9. Test upload/download and failure handling.
10. Monitor cost and access trends.

## Decision points
Prefer regional storage when workloads are region-bound and latency/cost matter; use dual-region or multi-region for broader resilience requirements.

## Common failure patterns
Public buckets by accident, no lifecycle policy, excessive version retention, wrong location, and assuming object storage provides filesystem semantics.

## Verification
Inspect effective IAM, retention behavior, lifecycle simulation, encryption metadata, and recovery from deleted/overwritten objects where applicable.

## Expected output
A governed object-storage configuration.

## Stop conditions
Stop if legal retention or residency requirements are unresolved.