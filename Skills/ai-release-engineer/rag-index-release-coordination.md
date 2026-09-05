# RAG and Index Release Coordination

## Purpose
Release retrieval corpora, embeddings, indexes, rerankers, and grounding logic as controlled artifacts so model behavior remains traceable and access-safe.

## When to use
Use for corpus refreshes, embedding-model changes, chunking changes, index rebuilds, reranker updates, metadata/ACL changes, or retrieval-configuration releases.

## Inputs
Corpus version, ingestion jobs, index version, embedding model, ranking configuration, ACL metadata, retrieval evaluations, rollback target.

## Preconditions
The old index remains available until the new release is validated, unless storage constraints are explicitly accepted.

## Context to inspect
Ingestion pipeline, document deletion propagation, tenant filters, index aliases, caches, chunking, ranking, query rewriting, and retrieval observability.

## Core knowledge
RAG releases can change answers without any model or application-code change. Index aliases are production routing controls. Access-control metadata must migrate atomically enough to avoid unauthorized retrieval.

## Procedure
1. Freeze the intended corpus snapshot.
2. Validate ingestion completeness and deletion handling.
3. Build a versioned index rather than mutating the active index in place.
4. Verify ACL and tenant metadata before serving traffic.
5. Compare retrieval quality against the current index.
6. Test high-risk queries and stale-document scenarios.
7. Warm the candidate index where required.
8. Shift a small traffic cohort or shadow queries.
9. Monitor retrieval relevance, misses, latency, and authorization denials.
10. Promote the index alias only after acceptance criteria pass.
11. Retain the previous index for rollback according to policy.

## Decision points
Use blue/green indexes for major embedding or schema changes. Use incremental updates only when consistency and rollback semantics are well understood.

## Common failure patterns
In-place index mutation, stale aliases, incomplete deletes, ACL metadata lag, cache contamination, and evaluating only downstream generated answers.

## Verification
Confirm corpus counts, ACL tests, retrieval benchmarks, alias state, and representative end-to-end grounding behavior.

## Expected output
A versioned RAG release record with corpus/index identity, evaluation evidence, promotion status, and rollback target.

## Stop conditions
Stop immediately when cross-tenant retrieval, missing deletion, or unresolved index inconsistency is detected.