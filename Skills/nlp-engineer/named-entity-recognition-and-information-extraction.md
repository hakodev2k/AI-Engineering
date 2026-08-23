# Named Entity Recognition and Information Extraction

## Purpose
Extract reliable entities, spans, attributes, and relations from unstructured text with explicit schema and boundary rules.

## When to use
Use for NER, document parsing, compliance extraction, knowledge ingestion, or structured downstream automation.

## Inputs
Extraction schema, annotated examples, document types, downstream contract, latency and precision/recall targets.

## Preconditions
Entity definitions and overlap/nesting rules are explicit.

## Context to inspect
Span disagreements, OCR quality, document layout, multilingual content, abbreviations, domain terminology, downstream validation.

## Core knowledge
Extraction errors include wrong type, wrong boundary, missing entity, spurious entity, and relation errors. Exact-match scores should be complemented by error categories and downstream validity.

## Procedure
1. Define entity and relation schema.
2. Specify span, nesting, normalization, and null rules.
3. Build leakage-safe train/evaluation splits.
4. Establish rules or dictionary baseline where useful.
5. Train/evaluate sequence, span, or generative extraction approach.
6. Measure entity-level precision/recall/F1 and boundary errors.
7. Add canonicalization or entity linking only where needed.
8. Validate structured outputs against schema and business constraints.
9. Inspect rare entities and unseen terminology.
10. Define confidence-based review for high-risk extraction.

## Decision points
Use deterministic patterns for stable high-precision formats; learned extraction for linguistic variability; hybrid systems when rules can enforce hard constraints.

## Common failure patterns
Ambiguous entity definitions, token-level metrics only, train/test documents from same source template, ignoring nested spans, and accepting syntactically valid but semantically impossible outputs.

## Verification
Gold-set entity metrics, schema validation, downstream acceptance tests, and edge-case reviews pass.

## Expected output
Extraction model/pipeline, schema, normalization rules, evaluation report, confidence policy, and failure taxonomy.

## Stop conditions
Stop when schema ambiguity dominates errors or downstream consumers cannot define acceptable entity semantics.