# LLM-Assisted Entity Linking

## Purpose
Use LLMs or embedding models to map mentions in text to canonical graph entities while preserving precision, explainability, and safe fallback behavior.

## When to use
Use when documents, conversations, or extracted facts contain ambiguous entity mentions that must connect to a knowledge graph.

## Inputs
Mention text, local context, candidate entities, aliases, identifiers, graph neighborhoods, labeled examples, confidence requirements.

## Preconditions
A canonical identity model and candidate-generation strategy exist.

## Context to inspect
Alias tables, entity types, embedding indexes, prior linking rules, model prompts, confidence thresholds, review queues, privacy constraints.

## Core knowledge
Entity linking is a ranking problem, not only generation. LLMs can improve contextual disambiguation but may fabricate identifiers or overstate certainty. Candidate restriction, type constraints, and calibrated abstention are essential.

## Procedure
1. Normalize mentions without destroying meaningful distinctions.
2. Generate candidates from aliases, lexical search, embeddings, or graph context.
3. Filter candidates by entity type and deterministic constraints.
4. Ask the model to rank only provided candidates when possible.
5. Capture evidence used for selection.
6. Calibrate confidence on labeled examples.
7. Define accept, review, and abstain thresholds.
8. Preserve unresolved mentions rather than forcing matches.
9. Evaluate by entity type and ambiguity class.
10. Monitor drift and high-impact false links.

## Decision points
Use deterministic linking for strong identifiers; use model-assisted ranking for ambiguous mentions. Prefer abstention when a false link can corrupt important graph neighborhoods.

## Common failure patterns
Allowing free-form IDs, evaluating only overall accuracy, ignoring NIL/unseen entities, leaking context across tenants, and forcing every mention to resolve.

## Verification
Measure precision, recall, top-k accuracy, abstention quality, and manual-review outcomes on held-out examples.

## Expected output
A candidate-generation and ranking pipeline with calibrated thresholds, evidence, tests, and fallback behavior.

## Stop conditions
Escalate when identity ambiguity affects regulated, financial, medical, or security-critical entities and reliable human review is unavailable.