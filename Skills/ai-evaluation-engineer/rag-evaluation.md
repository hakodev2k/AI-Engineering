# RAG Evaluation

## Purpose
Evaluate retrieval-augmented generation as a multi-stage system so retrieval defects are not confused with generation defects.

## When to use
Use when assessing RAG pipelines, vector search changes, chunking strategies, rerankers, embedding models, citation behavior, or grounding quality.

## Inputs
- Queries and expected evidence
- Retrieved documents/chunks
- Generated answers
- Corpus metadata
- Relevance labels or references

## Context to inspect
Inspect ingestion, chunking, metadata filters, embedding model, retrieval depth, reranking, prompt construction, citation formatting, and corpus freshness.

## Core knowledge
RAG quality decomposes into retrieval recall/precision, ranking quality, context sufficiency, groundedness, answer correctness, citation accuracy, and abstention. A good answer can hide poor retrieval on easy items; retrieval must be measured directly.

## Procedure
1. Define representative query classes and high-risk knowledge tasks.
2. Label supporting evidence for a benchmark subset.
3. Measure retrieval recall and relevance at appropriate cutoffs.
4. Inspect ranking and filtering failures separately from corpus gaps.
5. Evaluate whether retrieved context contains sufficient evidence.
6. Score answer correctness and groundedness against available evidence.
7. Verify citation-to-claim alignment where citations are exposed.
8. Test unanswerable and stale-information cases for correct abstention.
9. Compare pipeline variants using identical query sets and corpus snapshots.
10. Analyze failures by query class, corpus source, and retrieval stage.

## Decision points
Increase retrieval depth when recall is low and context budget permits; improve reranking when relevant evidence exists but ranks poorly; fix corpus ingestion when required evidence is absent. Do not compensate for retrieval failure solely through prompt changes.

## Common failure patterns
- Measuring only final-answer quality
- Treating lexical overlap as groundedness
- Evaluating against changing corpus snapshots
- Ignoring metadata-filter failures
- Accepting citations that do not support claims

## Verification
Reproduce retrieval outputs from a frozen corpus, confirm labeled evidence can be recovered, and validate final-answer improvements correlate with corrected retrieval behavior.

## Expected output
A stage-by-stage RAG evaluation report with retrieval, grounding, answer, citation, and abstention metrics.

## Stop conditions
Stop when the corpus version is unknown, relevance labels are unusable, or the system cannot expose retrieval evidence needed for diagnosis.