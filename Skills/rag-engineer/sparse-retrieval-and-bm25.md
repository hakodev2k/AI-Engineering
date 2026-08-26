# Sparse Retrieval and BM25

## Purpose
Implement lexical retrieval that handles exact terms, identifiers, rare entities, and vocabulary that dense models may blur.

## When to use
Use when queries contain product codes, names, error strings, legal phrases, or when lexical evidence improves recall.

## Inputs
Corpus text, analyzers/tokenizers, query set, relevance labels, language requirements, field metadata.

## Context to inspect
Inspect tokenization, stemming, stopwords, field weighting, identifier patterns, synonyms, and dense-retrieval misses.

## Core knowledge
BM25-style ranking rewards term specificity and saturation. Analyzer choices can dominate results. Sparse retrieval is complementary to dense retrieval, not inherently obsolete.

## Procedure
1. Identify query segments requiring lexical precision.
2. Configure language and field analyzers.
3. Preserve identifiers that should not be stemmed or split incorrectly.
4. Index meaningful fields separately where weighting helps.
5. Establish sparse-only baseline metrics.
6. Tune field boosts and query behavior against labels.
7. Add synonyms cautiously and measure false positives.
8. Analyze zero-result and high-score irrelevant cases.
9. Integrate with hybrid fusion if beneficial.
10. Monitor vocabulary and analyzer regressions.

## Decision points
Use exact keyword fields for IDs; analyzed fields for natural language. Prefer query-time expansion when synonym policy changes frequently.

## Common failure patterns
English analyzer on multilingual corpus; stopword removal that changes legal meaning; aggressive fuzzy matching; sparse retrieval omitted despite identifier-heavy traffic.

## Verification
Evaluate lexical query slices, exact-identifier tests, zero-result rate, and downstream hybrid gains.

## Expected output
A measured sparse retrieval configuration with documented analyzer semantics.

## Stop conditions
Stop when language/tokenization requirements are unclear enough to risk systematic recall loss.