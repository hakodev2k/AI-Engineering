# Reranking Rules

## Purpose
Improve final candidate ordering using measurable relevance evidence.

## Scope
Cross-encoders, LLM rerankers, heuristic rerankers, candidate limits, and score calibration.

## MUST
- Rerankers MUST be evaluated against a retrieval baseline before production use.
- Candidate count and reranker latency MUST be bounded.
- Reranking MUST preserve authorization and source metadata.
- Reranker model, prompt, and configuration versions MUST be traceable.
- Quality claims MUST use labeled or defensible relevance evidence.

## MUST NOT
- MUST NOT allow reranking to reintroduce filtered or unauthorized content.
- MUST NOT use a high-cost reranker without measuring marginal quality benefit.
- MUST NOT treat reranker confidence as ground-truth relevance.

## SHOULD
- Measure gains by query class and failure mode.
- Prefer deterministic reranking for critical reproducibility where practical.

## Exceptions
Heuristic reranking is acceptable when simpler evidence-backed logic meets requirements.

## Verification
Inspect relevance evaluations, latency benchmarks, candidate traces, model versions, and authorization tests.