# Retrieval System Design

## Purpose
Design production RAG retrieval systems that return evidence useful for generation rather than merely similar text.

## When to use
Use when creating or redesigning retrieval for assistants, search-grounded workflows, or knowledge applications. Do not use when the task needs deterministic database lookup only.

## Inputs
User questions, corpus characteristics, freshness requirements, latency/cost targets, security boundaries, evaluation data.

## Context to inspect
Inspect source systems, document types, query distribution, current indexes, model constraints, ACLs, telemetry, and failure examples before selecting architecture.

## Core knowledge
Retrieval quality depends on corpus representation, candidate generation, ranking, filtering, context assembly, and freshness. Optimize end-to-end answer utility; recall alone is insufficient. Separate retrieval failures from generation failures.

## Procedure
1. Define answerable question classes and unsupported cases.
2. Map authoritative sources and ownership.
3. Establish retrieval and answer-quality baselines.
4. Choose sparse, dense, structured, or hybrid candidate generation.
5. Define metadata and authorization filters.
6. Design ranking and reranking stages.
7. Specify context budget and evidence assembly.
8. Define freshness and reindexing behavior.
9. Instrument stage latency, candidate counts, misses, and provenance.
10. Evaluate on representative and adversarial queries.
11. Load-test expected concurrency and corpus scale.
12. Document fallback and degradation behavior.

## Decision points
Prefer hybrid retrieval when lexical identifiers and semantic intent both matter. Use structured lookup for exact facts with stable schemas. Add reranking only when measured relevance gains justify latency and cost.

## Common failure patterns
Optimizing embeddings without evaluating answers; indexing untrusted duplicates; ignoring ACLs; retrieving excessive context; no freshness SLA; tuning against anecdotal prompts.

## Verification
Verify retrieval metrics, grounded answer metrics, ACL isolation, freshness, latency percentiles, and failure-mode tests independently.

## Expected output
A justified retrieval architecture, measurable quality targets, operational controls, and evidence from evaluation.

## Stop conditions
Stop when authoritative sources, access rules, or representative evaluation queries cannot be established.