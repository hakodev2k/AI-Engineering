# Hybrid Retrieval

## Purpose
Combine lexical, vector, structured, and specialized retrieval without unstable or opaque result behavior.

## Scope
Candidate generation, fusion, normalization, blending, and reranking.

## MUST
- Define candidate budgets and fusion semantics explicitly.
- Normalize heterogeneous scores only using a validated method.
- Measure each retrieval channel's marginal contribution and failure modes.
- Ensure filters and authorization constraints apply consistently across all channels.

## MUST NOT
- Merge incomparable raw scores as though they share a common scale.
- Allow one retrieval path to bypass mandatory filters.
- Increase candidate breadth without evaluating latency and downstream reranking cost.

## SHOULD
- Retain channel-level diagnostics for sampled queries.
- Prefer robust fusion methods over fragile hand-tuned thresholds when evidence supports them.

## Exceptions
Exceptions require relevance and latency evidence plus a documented containment strategy.

## Verification
Use ablation studies, authorization tests, fusion regression tests, trace inspection, and load measurements.