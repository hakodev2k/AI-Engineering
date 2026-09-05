# Information Extraction to Graph

## Purpose
Convert unstructured documents or messages into graph-ready entities, relations, attributes, and evidence with controlled uncertainty.

## When to use
Use for document knowledge extraction, event extraction, relationship discovery, or graph enrichment from text.

## Inputs
Documents, target ontology, extraction schema, labeled examples, model options, confidence policy, provenance requirements.

## Preconditions
Target graph concepts and source-document rights are defined.

## Context to inspect
OCR/parser outputs, chunking, NER/relation extraction, LLM prompts, schemas, entity linking, provenance, validation, ingestion flow.

## Core knowledge
Extraction and canonicalization are separate problems. Generated facts must retain source evidence, confidence, and uncertainty. Structured output does not guarantee semantic correctness.

## Procedure
1. Define exactly which graph facts are extractable.
2. Parse and segment source content while preserving location metadata.
3. Extract typed mentions and relationships into a strict schema.
4. Validate syntax, datatypes, and allowed predicates.
5. Link mentions to canonical entities conservatively.
6. Preserve source spans and extraction/model version.
7. Calibrate confidence and review thresholds.
8. Reject unsupported or contradictory assertions.
9. Ingest accepted facts idempotently.
10. Evaluate precision/recall by entity and relation type.

## Decision points
Use deterministic parsers for stable structured patterns; use ML/LLMs for semantic variability. Require human review for high-impact low-confidence relations.

## Common failure patterns
Treating extracted mentions as canonical entities, losing evidence spans, accepting model-generated relations without support, and hiding extraction uncertainty.

## Verification
Compare against a labeled holdout set, manually inspect difficult cases, validate graph constraints, and trace each accepted assertion back to source evidence.

## Expected output
A versioned extraction pipeline, schemas, confidence policy, evaluation results, and provenance-preserving graph mappings.

## Stop conditions
Escalate when extraction quality is below the task threshold, source licensing is unclear, or sensitive data would be exposed improperly.