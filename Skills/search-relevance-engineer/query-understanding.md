# Query Understanding

## Purpose
Interpret user queries into structured signals that improve retrieval and ranking without silently changing intent.

## When to use
Use when search quality suffers from ambiguous queries, entities, abbreviations, natural-language phrasing, or heterogeneous intent.

## Inputs
Query logs, catalog/domain vocabulary, click or conversion signals, known entities, locale information, search requirements.

## Context to inspect
Existing parsers, analyzers, query rewrites, stop-word behavior, synonym rules, intent labels, entity metadata, and failure examples.

## Core knowledge
Query understanding may include normalization, intent classification, entity recognition, attribute extraction, rewrite generation, language detection, and query segmentation. Each transformation can improve recall but also introduce false matches.

## Procedure
1. Sample high-volume, zero-result, and high-abandonment queries.
2. Classify dominant intents and ambiguity patterns.
3. Identify entities, attributes, operators, and constraints.
4. Define safe normalization before semantic rewrites.
5. Add intent or entity extraction only where it changes downstream behavior.
6. Preserve original query alongside derived representations.
7. Attach confidence to probabilistic interpretations.
8. Define fallbacks when confidence is low.
9. Evaluate rewrites against judged query-document pairs.
10. Monitor drift and newly emerging vocabulary.

## Decision points
Use deterministic parsing for stable domain syntax; ML or LLM-based interpretation when linguistic variability justifies the cost and uncertainty. Apply rewrites only above an evidence-backed confidence threshold.

## Common failure patterns
Over-aggressive rewriting, deleting meaningful tokens, treating guessed attributes as hard filters, ignoring locale, and evaluating only successful examples.

## Verification
Measure relevance before and after on impacted query segments, inspect false rewrites manually, and verify low-confidence cases preserve baseline behavior.

## Expected output
Query interpretation contract, transformations, confidence rules, fallback behavior, evaluation evidence, and monitoring signals.

## Stop conditions
Stop when intent labels are undefined, rewrites materially alter user intent without evidence, or evaluation data is insufficient to bound regressions.