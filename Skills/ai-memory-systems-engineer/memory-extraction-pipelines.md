# Memory Extraction Pipelines

## Purpose
Extract durable, useful memories from conversations, tool results, documents, and events without persisting irrelevant or unsafe content.

## When to use
Use when converting raw interaction streams into structured memory candidates.

## Inputs
Interaction logs, memory taxonomy, extraction prompts/models, confidence thresholds, sensitivity rules, retention policy.

## Preconditions
Define eligible memory classes and prohibited data categories.

## Context to inspect
Message roles, tool traces, attachments, existing memories, extraction failures, user corrections, and downstream retrieval needs.

## Core knowledge
Extraction is an information-selection problem. High recall creates noisy memory; high precision can miss useful facts. Provenance and confidence are essential because extracted memories may be inferred rather than explicitly stated.

## Procedure
1. Segment source events into extraction units.
2. Apply eligibility filters before model inference.
3. Extract typed candidate memories.
4. Attach provenance, timestamps, and confidence.
5. Normalize entities and values.
6. Detect duplicates and contradictions.
7. Apply sensitivity and retention policy.
8. Route low-confidence candidates for rejection or review.
9. Persist accepted memories idempotently.
10. Measure precision, recall, and downstream usefulness.

## Decision points
Use deterministic extractors for stable structured signals and model-based extraction for semantic information. Require higher confidence for sensitive or identity-bearing facts.

## Common failure patterns
Saving every message; losing provenance; extracting hypothetical statements as facts; duplicate writes on retries; trusting model confidence blindly.

## Verification
Evaluate against labeled interactions and inspect false-positive memories by category and sensitivity.

## Expected output
A reproducible extraction pipeline with typed, traceable, policy-compliant memories.

## Stop conditions
Stop when provenance cannot be preserved or policy does not define whether a candidate may be stored.