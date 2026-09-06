# Retrieval Cost and Latency Optimization

## Purpose
Reduce end-to-end knowledge retrieval cost and response latency without silently degrading relevance, freshness, authorization, or citation quality.

## When to use
Use when RAG or search violates latency SLOs, vector/reranker spend grows rapidly, or scaling requires architectural trade-offs.

## Inputs
Traffic profile, latency traces, index metrics, candidate counts, model costs, cache behavior, corpus size, quality benchmarks, and SLOs.

## Context to inspect
Inspect p50/p95/p99 latency by stage, embedding calls, lexical/vector queries, metadata filters, rerankers, context assembly, network hops, cache hit rates, and infrastructure utilization.

## Core knowledge
Optimization should target measured bottlenecks. Candidate fan-out, cross-region calls, reranking depth, oversized context, repeated embeddings, and poor index filters often dominate cost or latency. Caching improves performance only when freshness and authorization semantics remain correct.

## Procedure
1. Establish baseline quality, cost per query, and latency by stage.
2. Segment workload by query type and traffic importance.
3. Identify the largest latency and cost contributors from traces.
4. Eliminate redundant network, embedding, and retrieval work.
5. Tune candidate counts and ANN parameters against held-out quality metrics.
6. Apply reranking selectively when marginal quality gain justifies cost.
7. Introduce safe caches with versioned keys, security context, and invalidation rules.
8. Reduce context payload by removing redundant or low-value evidence.
9. Consider routing simple queries to cheaper retrieval paths.
10. Load-test expected and burst traffic.
11. Compare optimized behavior with the quality baseline before release.

## Decision points
Prefer architectural removal of unnecessary work before scaling hardware. Cache stable public knowledge aggressively; cache permissioned or rapidly changing knowledge only with correct identity and invalidation semantics.

## Common failure patterns
Optimizing averages instead of tail latency, shrinking candidate sets without recall checks, sharing caches across authorization contexts, premature hardware scaling, and reducing context until citations lose support.

## Verification
Measure p95/p99 latency, cost per successful query, throughput, cache correctness, retrieval metrics, groundedness, and permission safety under load.

## Expected output
A measured optimization plan and validated configuration with before/after cost, latency, quality, and risk evidence.

## Stop conditions
Stop when proposed savings violate access control, freshness, or quality thresholds, or load testing cannot represent the production workload sufficiently.