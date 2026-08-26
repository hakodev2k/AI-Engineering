# Secure Feature and Embedding Handling

## Purpose
Protect learned features and embeddings from unauthorized access, cross-tenant leakage, poisoning, inversion, and accidental treatment as non-sensitive data.

## When to use
Use for feature stores, embedding indexes, retrieval systems, similarity services, and shared online/offline feature pipelines.

## Inputs
Feature schemas, embedding sources, storage/index design, tenant boundaries, update paths, retention, model consumers, and privacy classification.

## Preconditions
Identify source data sensitivity and permitted downstream purposes.

## Context to inspect
Inspect feature computation, online/offline stores, vector indexes, metadata filters, caches, ingestion permissions, query APIs, backups, and deletion propagation.

## Core knowledge
Derived representations may retain sensitive information and are not automatically anonymous. Vector similarity can reveal membership or attributes. Integrity is also critical because poisoned features/embeddings can steer predictions or retrieval.

## Procedure
1. Classify features and embeddings based on source and demonstrated leakage risk.
2. Record provenance from source records to derived representations.
3. Enforce tenant and purpose-based authorization.
4. Separate write permissions from read/query permissions.
5. Validate update sources and detect abnormal value/distribution changes.
6. Protect metadata filters from client-controlled authorization bypass.
7. Bound nearest-neighbor/result exposure and query volume.
8. Encrypt sensitive stores in transit and at rest according to policy.
9. Define retention and deletion propagation from source to derived data.
10. Test inversion/membership risks when sensitivity warrants it.
11. Audit high-volume exports and unusual similarity probing.

## Decision points
Treat embeddings as sensitive when source data or empirical tests justify it. Use separate indexes for strong tenant boundaries; logical filtering is acceptable only when enforced server-side and thoroughly tested.

## Common failure patterns
Assuming vectors are anonymous; tenant filtering supplied only by the client; unrestricted bulk export; no deletion propagation; shared write credentials; poisoning through unauthenticated feature updates.

## Verification
Test cross-tenant queries, unauthorized writes, deletion propagation, anomaly alerts, export controls, and representative privacy attacks where applicable.

## Expected output
A controlled feature/embedding lifecycle with provenance, authorization, integrity checks, privacy controls, and verified deletion.

## Stop conditions
Stop when source-data usage rights are unclear, tenant isolation cannot be guaranteed, or derived-data deletion obligations cannot be met.