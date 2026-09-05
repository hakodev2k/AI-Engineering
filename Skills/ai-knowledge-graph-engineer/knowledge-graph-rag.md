# Knowledge Graph RAG

## Purpose
Use structured graph knowledge to improve AI retrieval, grounding, relationship-aware context construction, and answer traceability.

## When to use
Use when vector similarity alone misses multi-hop relationships, exact entities, authoritative facts, constraints, or provenance needed for LLM answers.

## Inputs
User question patterns, graph schema, graph queries, embedding/vector layer, LLM context limits, evaluation set, provenance requirements.

## Preconditions
Graph data quality and authorization boundaries are trustworthy.

## Context to inspect
Entity linking, vector retrieval, graph traversal, query generation, reranking, context serialization, prompt templates, citations, evaluation metrics.

## Core knowledge
Graph RAG can combine lexical/vector retrieval with entity resolution and bounded traversal. More graph context is not always better: irrelevant neighborhoods increase token cost and hallucination risk. Provenance and authorization must survive retrieval.

## Procedure
1. Classify questions requiring graph structure versus semantic similarity.
2. Resolve entities conservatively.
3. Select a bounded graph query or traversal.
4. Retrieve only relationships needed for the question.
5. Combine graph facts with unstructured evidence when useful.
6. Preserve source provenance and timestamps.
7. Serialize context clearly without losing relationship semantics.
8. Enforce authorization before context reaches the model.
9. Evaluate factuality, completeness, citation accuracy, latency, and cost.
10. Monitor failed entity links and over-retrieval.

## Decision points
Use graph-only retrieval for exact relational questions; hybrid graph+vector retrieval for narrative or document-heavy questions. Prefer deterministic query templates for high-risk domains over unrestricted text-to-query generation.

## Common failure patterns
Dumping entire neighborhoods into context, weak entity linking, graph traversal after authorization, silent stale facts, unbounded text-to-Cypher/SPARQL, and treating graph facts as automatically true.

## Verification
Run a held-out evaluation set and inspect retrieved subgraphs, authorization, citations, answer faithfulness, latency, and token usage.

## Expected output
A graph-RAG retrieval design, query strategy, context format, evaluation evidence, and failure-monitoring plan.

## Stop conditions
Escalate when graph authorization cannot be enforced before model context construction or generated queries can access unrestricted graph data.