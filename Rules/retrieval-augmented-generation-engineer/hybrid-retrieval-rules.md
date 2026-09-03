# Hybrid Retrieval Rules

## Purpose
Govern combinations of lexical, vector, structured, graph, or other retrieval methods so fusion improves coverage without obscuring failure modes.

## Scope
Applies to multi-retriever architectures, score fusion, routing, fallback retrieval, and ensemble candidate generation.

## MUST
- Each retrieval channel MUST have a documented purpose, candidate contract, and measurable contribution.
- Fusion logic MUST define score normalization, weighting, deduplication, and tie behavior explicitly.
- Hybrid retrieval MUST be compared against simpler baselines on representative queries.
- Candidate provenance MUST identify which retriever produced or promoted each result.
- Routing between retrieval methods MUST be deterministic or observable enough to reproduce decisions.
- Failure of one retriever MUST have defined degradation behavior rather than silently producing malformed fused results.

## MUST NOT
- Additional retrievers MUST NOT be added solely to increase candidate count without evidence of relevance benefit.
- Incompatible score ranges MUST NOT be combined directly without normalization or a validated alternative.
- Fallback paths MUST NOT bypass authorization or source-quality requirements.

## SHOULD
- Tune hybrid weights by query class when evidence shows materially different retrieval needs.
- Keep retriever-specific metrics so degraded channels can be isolated quickly.
- Prefer fusion mechanisms that can be explained and regression-tested.

## Exceptions
Exceptions require benchmark evidence, operational rationale, documented risk, and review when complexity materially increases production cost or security surface.

## Verification
Use per-retriever recall metrics, fusion ablations, end-to-end relevance benchmarks, failure injection, score-trace inspection, and authorization tests.