# Access-Control-Aware Retrieval

## Purpose
Ensure AI retrieval never exposes knowledge a user is not authorized to access, while preserving usable search quality and operational clarity.

## When to use
Use for enterprise search, RAG, copilots, multi-tenant systems, or any corpus containing restricted content.

## Inputs
Identity claims, source ACLs, tenant boundaries, group memberships, document permissions, index capabilities, caching design, and audit requirements.

## Context to inspect
Inspect source permission semantics, ingestion mappings, authorization middleware, vector and lexical filters, caches, logs, service identities, and cross-tenant data paths.

## Core knowledge
Authorization must be enforced before content reaches the model or user. Retrieval systems often duplicate source permissions imperfectly, so permission synchronization and deny behavior are critical. Security filters are hard constraints, not ranking hints.

## Procedure
1. Map source authorization semantics into canonical principals and resource permissions.
2. Preserve ACLs through ingestion, chunking, indexing, and derived artifacts.
3. Define user-to-principal resolution and group expansion rules.
4. Apply tenant and ACL filters before candidate content can enter prompts or rerankers.
5. Prevent privileged service identities from broadening end-user access.
6. Design cache keys to include security context where responses or retrievals are cached.
7. Propagate permission changes and revocations within defined SLAs.
8. Test explicit allow, explicit deny, inherited access, group changes, and tenant boundaries.
9. Audit access decisions without logging sensitive content unnecessarily.
10. Fail closed when authorization metadata is missing or ambiguous.

## Decision points
Use index-time filtering when the backend supports secure predicates efficiently; use physically isolated indexes when policy, residency, or tenant risk justifies stronger separation.

## Common failure patterns
Filtering after generation, stale group memberships, ACLs only on parent documents but not chunks, shared caches across security contexts, and default-allow behavior for missing metadata.

## Verification
Run adversarial permission tests, revoke access and measure propagation, inspect prompt traces for unauthorized text, and verify tenant isolation under concurrent load.

## Expected output
An authorization-aware retrieval design, synchronization SLA, test suite, and audit evidence.

## Stop conditions
Stop when source ACL semantics cannot be represented faithfully, identity resolution is unreliable, or the retrieval backend cannot enforce required isolation safely.