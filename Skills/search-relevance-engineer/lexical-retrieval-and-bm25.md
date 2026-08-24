# Lexical Retrieval and BM25

## Purpose
Build and tune lexical candidate retrieval using exact terms, field weighting, phrase matching, and BM25-style scoring.

## When to use
Use when implementing baseline retrieval, improving exact-term relevance, or diagnosing poor recall/precision in keyword search.

## Inputs
Judged queries, query logs, indexed fields, analyzers, corpus statistics, current query DSL and ranking behavior.

## Context to inspect
Field boosts, match operators, minimum-should-match, phrase queries, tie breakers, BM25 parameters, document length distributions, and score explanations.

## Core knowledge
BM25 balances term frequency, inverse document frequency, and document-length normalization. Retrieval quality depends heavily on analyzers, field boundaries, query construction, and candidate limits—not only BM25 parameters.

## Procedure
1. Establish a judged lexical baseline.
2. Inspect score explanations for representative good and bad results.
3. Separate exact identifier/name fields from descriptive text.
4. Add exact and phrase signals before broad fuzzy matching.
5. Tune field weights from evidence.
6. Adjust minimum-should-match by query length or intent when justified.
7. Review document-length effects.
8. Tune BM25 parameters only after query structure and analysis are sound.
9. Evaluate recall and ranking metrics by query segment.
10. Check latency and candidate counts under load.

## Decision points
Favor lexical retrieval for exact names, identifiers, rare terms, and transparent matching. Use broad matching only when recall gains exceed precision loss.

## Common failure patterns
Arbitrary boosts, fuzzy matching on every token, tuning against a handful of queries, ignoring analyzer effects, and treating raw score as comparable across different queries.

## Verification
Compare offline metrics and score explanations to baseline; verify critical exact matches and no significant latency regression.

## Expected output
Retrieval query design, calibrated field weights, evaluation results, identified trade-offs, and rollback configuration.

## Stop conditions
Stop when judgments are too sparse to distinguish improvements, analyzers are incorrect, or scoring changes cannot be isolated from simultaneous schema changes.