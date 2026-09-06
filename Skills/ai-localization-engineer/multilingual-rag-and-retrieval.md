# Multilingual RAG and Retrieval

## Purpose
Design retrieval-augmented generation so users receive relevant, authoritative evidence in the correct language and market context.

## When to use
Use when knowledge bases, search indexes, embeddings, or grounding pipelines serve multiple languages or regions.

## Inputs
Corpus inventory, locale metadata, embedding models, chunking rules, retrieval metrics, ranking strategy, access controls, and target queries.

## Preconditions
Documents have identifiable provenance and locale or language metadata can be assigned reliably.

## Context to inspect
Inspect ingestion, normalization, chunking, embeddings, indexes, filters, rerankers, citations, access control, and fallback behavior.

## Core knowledge
Cross-lingual retrieval can improve recall but may return legally or semantically inappropriate regional content. Embedding quality, tokenization, morphology, translation, and corpus imbalance affect retrieval differently by language.

## Procedure
1. Inventory corpora by language, locale, authority, and freshness.
2. Normalize and preserve locale metadata during ingestion.
3. Evaluate multilingual embedding and reranking quality on real queries.
4. Decide whether to index per locale, jointly, or hybrid.
5. Define locale-aware filtering and fallback rules.
6. Test cross-language queries and translated queries separately.
7. Validate citation fidelity and answer grounding.
8. Measure recall, precision, ranking quality, and downstream task success by locale.

## Decision points
Use shared indexes when cross-language retrieval adds value and policy permits it; isolate indexes when regulation, terminology, freshness, or access boundaries differ materially.

## Common failure patterns
Dropping locale metadata, retrieving the wrong regional policy, English-dominant embeddings, translating queries without evaluating semantic drift, and evaluating retrieval only through final answer quality.

## Verification
Demonstrate locale-correct retrieval, source authority, permission enforcement, citation accuracy, and acceptable retrieval metrics for each supported locale.

## Expected output
A tested multilingual retrieval design with indexing, filtering, ranking, fallback, and evaluation rules.

## Stop conditions
Stop when authoritative locale content is unavailable, permissions cannot be enforced, or retrieval quality cannot meet the product’s risk threshold.