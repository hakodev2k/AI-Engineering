# Retrieval and Grounding Incident Response

## Purpose
Respond to incidents where RAG or grounding returns stale, unauthorized, poisoned, irrelevant, or missing context.

## When to use
Use for source-citation mismatches, tenant data crossover, sudden hallucination increase, stale knowledge, retrieval outages, or malicious corpus content.

## Inputs
Queries, retrieved chunks, ranking scores, corpus versions, index state, ACL metadata, embedding/model versions, ingestion logs.

## Preconditions
Preserve the exact retrieval evidence for failing requests.

## Context to inspect
Ingestion pipeline, chunking, embeddings, index aliases, filters, ACL enforcement, reranking, cache, source freshness, deletion propagation.

## Core knowledge
Grounded generation is only as trustworthy as retrieval correctness. Security filters must be applied before content reaches the model; post-generation filtering is insufficient for unauthorized context.

## Procedure
1. Reconstruct query-to-document retrieval.
2. Validate tenant and ACL filters.
3. Check index and corpus version.
4. Inspect top-k relevance and ranking changes.
5. Check ingestion failures, stale aliases, and cache.
6. Identify poisoned or malformed content.
7. Remove or quarantine unsafe sources.
8. Rebuild/repoint indexes when needed.
9. Replay failing cases and security tests.
10. Monitor retrieval quality and authorization metrics.

## Decision points
Disable grounding when corpus trust is compromised and safe fallback exists. Fail closed on authorization uncertainty.

## Common failure patterns
Treating model output as root cause, delayed document deletion, stale index aliases, ACL filtering after retrieval, and unvalidated emergency reindexing.

## Verification
Authorized users retrieve correct sources; unauthorized users cannot retrieve protected content; representative grounding tests pass.

## Expected output
Retrieval root cause, containment, repaired index/data path, and verification evidence.

## Stop conditions
Escalate immediately on cross-tenant or regulated-data exposure.