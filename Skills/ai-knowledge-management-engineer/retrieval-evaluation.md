# Retrieval Evaluation

## Purpose
Measure whether the knowledge retrieval layer returns relevant, authoritative, permission-safe evidence before blaming or tuning the generation model.

## When to use
Use before launch, after retrieval changes, when RAG answers degrade, or when comparing retrievers, chunking, embeddings, filters, or rerankers.

## Inputs
Representative queries, relevance judgments, expected sources, no-answer cases, retrieval traces, ranking outputs, and latency targets.

## Context to inspect
Inspect query distributions, source coverage, chunking, index versions, ranking stages, access filters, and known production misses.

## Core knowledge
Retrieval evaluation should separate recall from ranking quality. Useful metrics include recall@k, precision@k, MRR, nDCG, source diversity, authority compliance, and latency. Aggregate metrics can hide poor performance for important query segments.

## Procedure
1. Build a query set from real tasks, failures, and domain experts.
2. Label relevant evidence and canonical sources where feasible.
3. Include ambiguous, adversarial, exact-match, semantic, historical, and no-answer queries.
4. Freeze corpus and index versions for reproducibility.
5. Evaluate each retrieval stage independently.
6. Report recall, ranking, authority, permission, and latency metrics.
7. Segment results by domain, query type, language, and user cohort.
8. Inspect false positives and false negatives qualitatively.
9. Compare proposed changes against a stable baseline.
10. Promote only changes that improve meaningful metrics without violating guardrails.

## Decision points
Prioritize recall when downstream reranking can recover precision; prioritize top-rank precision when latency or context budget is tight. Weight high-risk domains separately from average traffic.

## Common failure patterns
Evaluating generated answers only, tiny handpicked query sets, leaking test queries into tuning, ignoring no-answer cases, and accepting average gains that harm critical segments.

## Verification
Reproduce results from versioned inputs, rerun on held-out queries, and confirm statistically or practically meaningful improvements.

## Expected output
A versioned retrieval benchmark with metrics, segment analysis, failure examples, and release recommendation.

## Stop conditions
Stop when relevance labels are unreliable, corpus versions are unknown, or evaluation queries do not represent real use.