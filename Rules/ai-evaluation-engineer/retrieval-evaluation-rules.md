# Retrieval Evaluation Rules

## Purpose
Evaluate retrieval quality independently from generation quality so RAG failures can be diagnosed and controlled.

## Scope
Applies to search, vector retrieval, hybrid retrieval, reranking, context selection, and retrieval-augmented generation systems.

## MUST
- Retrieval evaluation MUST define relevance criteria and reference evidence appropriate to the task.
- Retrieval quality MUST be measured separately from downstream answer quality when both can fail independently.
- Metrics MUST include coverage of missing-relevant-document and irrelevant-context failure modes where applicable.
- Changes to chunking, indexing, embeddings, filters, reranking, or retrieval configuration MUST trigger targeted regression evaluation.
- Access-control filtering MUST be tested to ensure unauthorized content cannot enter retrieved context.

## MUST NOT
- MUST NOT attribute an incorrect generated answer to the model when the required evidence was never retrieved without identifying that distinction.
- MUST NOT optimize only for recall when excessive irrelevant context materially harms quality, latency, cost, or safety.
- MUST NOT evaluate retrieval exclusively on synthetic queries if production intent distribution materially differs.

## SHOULD
- Retrieval suites SHOULD include ambiguous, sparse, multi-hop, and no-answer cases.
- Ranking metrics SHOULD be complemented by task-level utility measurements.

## Exceptions
Simple deterministic lookup systems may use narrower metrics if ranking quality is not meaningful.

## Verification
Inspect relevance labels, retrieval logs, ranking metrics, access-control tests, change-triggered regression runs, and end-to-end cases where retrieval and generation outcomes are analyzed separately.