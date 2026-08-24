# Text Analysis and Tokenization

## Purpose
Design analyzers and normalization pipelines that convert raw text into stable searchable terms while respecting language, domain vocabulary, and field semantics.

## When to use
Use when configuring indexes, diagnosing missing matches, supporting new languages, or changing tokenization, stemming, normalization, or stop-word behavior.

## Inputs
Representative documents, queries, languages, field definitions, domain terms, existing analyzer configuration, relevance examples.

## Context to inspect
Index-time and query-time analyzers, token filters, stemming, case folding, punctuation rules, n-grams, protected terms, and schema mappings.

## Core knowledge
Analyzer changes alter the searchable representation and usually require reindexing. Index-time and query-time analysis need not be identical, but mismatches must be intentional. Field semantics matter more than a universal analyzer.

## Procedure
1. Group fields by semantic purpose.
2. Collect representative tokens including edge cases.
3. Inspect current token streams for queries and documents.
4. Decide normalization, stemming, decompounding, and punctuation handling per field.
5. Protect identifiers, brands, codes, and domain-specific tokens from destructive transformations.
6. Use n-grams only where prefix/infix behavior is required.
7. Compare index-time and query-time token streams.
8. Evaluate exact-match preservation and recall changes.
9. Reindex into a versioned index.
10. Validate judged queries before promotion.

## Decision points
Prefer conservative analysis for identifiers and names; linguistic normalization for prose. Use language-specific analyzers where language detection is reliable.

## Common failure patterns
Universal stemming, excessive n-grams, removing meaningful stop words, accidental token splitting, analyzer changes without reindexing, and testing only English.

## Verification
Inspect token streams, run regression query sets, compare index size and latency, and verify exact matches retain priority where required.

## Expected output
Field-specific analyzer design, token examples, migration requirement, relevance evidence, and rollback plan.

## Stop conditions
Stop when language or field semantics are unknown, reindexing cannot be performed safely, or analyzer changes create unexplained relevance regressions.