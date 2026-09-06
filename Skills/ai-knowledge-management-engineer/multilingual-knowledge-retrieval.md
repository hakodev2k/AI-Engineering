# Multilingual Knowledge Retrieval

## Purpose
Design retrieval that works reliably across languages, scripts, locales, translated content, and mixed-language queries while preserving source authority and meaning.

## When to use
Use when knowledge or users span multiple languages, queries mix languages, or translated and original content coexist.

## Inputs
Supported languages, corpus distribution, query logs, embedding and reranking models, locale metadata, translation services, terminology lists, and evaluation data.

## Context to inspect
Inspect language detection, source locale, translation provenance, multilingual model coverage, tokenizer behavior, exact entity handling, and retrieval quality by language.

## Core knowledge
Multilingual retrieval can use cross-lingual embeddings, translated queries, translated documents, or language-specific indexes. Translation may alter terminology, named entities, legal nuance, or source authority. Language quality must be measured per locale rather than inferred from English performance.

## Procedure
1. Measure corpus and query distribution by language and locale.
2. Identify high-value cross-language retrieval scenarios.
3. Benchmark multilingual embeddings and lexical analyzers on representative data.
4. Preserve source language and translation status in metadata.
5. Decide when to search original-language content, translated representations, or both.
6. Protect exact names, codes, product identifiers, and domain terms during translation.
7. Apply locale-aware normalization and tokenization.
8. Evaluate retrieval and reranking per language and cross-language pair.
9. Validate citations link to the appropriate original or approved translation.
10. Monitor language-specific regressions and unsupported locales.

## Decision points
Prefer cross-lingual embeddings when semantic alignment is strong and translation latency is undesirable. Use approved translation layers when users require localized evidence or domain terminology must be controlled.

## Common failure patterns
Assuming English benchmarks generalize, translating identifiers, mixing locales without metadata, citing machine translations as canonical sources, and ignoring low-resource language degradation.

## Verification
Run language-specific and cross-language relevance tests, inspect named entities and terminology, and verify original-source provenance for translated evidence.

## Expected output
A multilingual retrieval strategy with supported locales, model choices, translation policy, metadata, and segmented evaluation results.

## Stop conditions
Stop when required languages lack acceptable retrieval quality, translation changes material meaning, or authoritative translation requirements are unresolved.