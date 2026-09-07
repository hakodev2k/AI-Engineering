# Retrieval and RAG Guardrails

## Purpose
Secure RAG against unauthorized retrieval, poisoned content, injection, unsafe disclosure.

## When to use
Use for vector/enterprise search, document QA, web retrieval, knowledge agents.

## Inputs
Architecture, ACLs, indexing, metadata, embeddings, ranking, prompts, trust labels.

## Context to inspect
Inspect ingestion, provenance, ACL propagation, tenancy, rewriting, ranking, context, citations, caches.

## Core knowledge
Authorize before model context; retrieved text is untrusted and indexes inherit sensitivity.

## Procedure
1. Preserve source/ACL/tenant/provenance.
2. Authorize during retrieval.
3. Enforce tenant isolation.
4. Quarantine poison where feasible.
5. Mark untrusted data.
6. Prevent policy changes from documents.
7. Minimize context.
8. Validate citations.
9. Test tenant/permission/injection cases.
10. Monitor anomalies.

## Decision points
Prefer hard ACL filtering before semantic ranking.

## Common failure patterns
Post-filtering, stale ACLs, trusted documents, fabricated citations, tenantless caches.

## Verification
Unauthorized protected content never enters model context.

## Expected output
Secured RAG pipeline and regressions.

## Stop conditions
Stop on cross-tenant/stale-permission exposure.