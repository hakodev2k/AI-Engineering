# Retrieval Evaluation and Error Analysis

## Purpose
Measure retrieval quality and diagnose why relevant evidence is missing or misranked.

## When to use
Use during development, regression analysis, and after corpus/index/model changes.

## Inputs
Evaluation queries, relevance labels, retrieved rankings, query metadata, pipeline traces.

## Context to inspect
Inspect candidate recall, rank positions, filters, rewritten queries, retriever contributions, chunk boundaries, and failed answer examples.

## Core knowledge
Metrics such as Recall@k, MRR, and NDCG answer different questions. Aggregate scores can hide severe failures in important segments. Diagnose pipeline stages before tuning parameters.

## Procedure
1. Freeze a reproducible pipeline version.
2. Compute retrieval metrics at operational k values.
3. Segment results by intent, language, source, tenant, and difficulty as relevant.
4. Classify failures: corpus absence, parsing, chunking, query, filtering, candidate generation, ranking, or freshness.
5. Inspect representative false positives and false negatives.
6. Quantify each failure class.
7. Propose the smallest intervention addressing dominant causes.
8. Re-run on development data.
9. Confirm gains on held-out data.
10. Record regressions and trade-offs.

## Decision points
Increase k only when relevant evidence exists just below cutoff and generation cost remains acceptable. Re-embed only when evidence points to semantic representation failure.

## Common failure patterns
Tuning from aggregate recall alone; changing multiple stages simultaneously; ignoring authorization-filter misses; judging retrieval from final answer only.

## Verification
Ensure metric computation is reproducible and improvements hold across critical segments and held-out cases.

## Expected output
A quantified failure taxonomy and evidence-backed remediation decision.

## Stop conditions
Stop tuning when relevance labels or pipeline traces are too unreliable to identify the failing stage.