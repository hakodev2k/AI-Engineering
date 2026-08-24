# Typo and Spell Correction

## Purpose
Recover user intent from misspellings and input errors while preventing fuzzy matching from overwhelming precise retrieval.

## When to use
Use when typo-heavy queries produce zero or poor results, especially on mobile, multilingual, or domain-specific search.

## Inputs
Query logs, vocabulary frequencies, catalog terms, locale, judgments, zero-result queries, edit-distance capabilities.

## Context to inspect
Existing fuzzy queries, dictionaries, suggesters, keyboard-distance logic, popularity signals, correction thresholds, and exact-match behavior.

## Core knowledge
Correction confidence should depend on vocabulary evidence, edit distance, query frequency, language, and whether the original query already has strong matches. Automatic replacement is riskier than suggestion.

## Procedure
1. Quantify typo-related zero and low-quality queries.
2. Build or select a domain-aware vocabulary.
3. Preserve identifiers, codes, names, and rare valid terms.
4. Generate correction candidates with bounded edit distance.
5. Rank candidates using language/domain frequency and context.
6. Set confidence thresholds for automatic correction versus suggestion.
7. Avoid correction when the original query has strong exact matches.
8. Evaluate known typo pairs and valid rare-term counterexamples.
9. Monitor correction acceptance and false-correction rates.
10. Version dictionaries and correction rules.

## Decision points
Use suggestions when confidence is moderate or user intent is sensitive; automatic correction only when evidence is strong. Prefer prefix completion over fuzzy expansion for short queries when appropriate.

## Common failure patterns
Fuzzy matching every token, correcting valid brands or codes, locale-insensitive dictionaries, popularity dominating intent, and hiding the original query.

## Verification
Measure recovered relevant results, false corrections, latency, and behavior on exact identifiers and rare valid terms.

## Expected output
Correction policy, candidate generation/ranking rules, thresholds, evaluation set, monitoring metrics, and fallback behavior.

## Stop conditions
Stop when domain vocabulary is unreliable, false-correction risk is high, or corrections cannot be surfaced transparently.