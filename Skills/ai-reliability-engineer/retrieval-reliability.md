# Retrieval Reliability

## Purpose
Keep retrieval-augmented AI systems dependable when indexes, embeddings, metadata filters, ingestion pipelines, or source systems degrade.

## When to use
Use for RAG systems where answer quality, authorization, or freshness depends on retrieved context.

## Inputs
Retrieval traces, index topology, corpus versions, ingestion status, relevance metrics, ACL metadata, cache state, embedding configuration.

## Preconditions
Representative retrieval queries and expected authorization behavior are available.

## Context to inspect
Ingestion, chunking, embeddings, vector/keyword search, reranking, index aliases, filters, freshness, deletion propagation, fallback behavior.

## Core knowledge
Retrieval reliability includes correctness, freshness, completeness, authorization, and availability. A technically available index can still be unreliable if it is stale, partially built, or missing required filters.

## Procedure
1. Define critical retrieval invariants and SLIs.
2. Trace ingestion through indexing and serving.
3. Monitor source lag, indexing lag, document counts, and failure rates.
4. Validate ACL and tenant filters independently.
5. Detect partial or stale index states.
6. Version indexes and aliases for reversible rollout.
7. Bound cache staleness.
8. Define safe behavior when retrieval is unavailable.
9. Test rebuild, failover, and deletion propagation.
10. Monitor end-to-end grounded-answer impact.

## Decision points
Fail closed when authorization cannot be guaranteed. Prefer explicit ungrounded-mode disclosure or unavailable responses when missing retrieval would create misleading confidence.

## Common failure patterns
Healthy index endpoint with stale content, silent ingestion gaps, stale aliases, partial rebuild promotion, cache hiding deletion, and authorization filters applied too late.

## Verification
Synthetic and real queries prove expected freshness, authorization, relevance, index version, and degraded-mode behavior.

## Expected output
A retrieval reliability design with invariants, telemetry, index lifecycle controls, fallback policy, and recovery tests.

## Stop conditions
Escalate on cross-tenant access, unrecoverable corpus inconsistency, or missing source-of-truth data.