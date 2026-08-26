# Text Data Generation

## Purpose
Create controlled synthetic text corpora for training, evaluation, classification, extraction, or robustness testing.

## When to use
When labeled text is scarce, rare intents need coverage, or sensitive examples cannot be reused directly.

## Inputs
Task taxonomy, label definitions, language/style distribution, prohibited content, seed examples, and quality rubric.

## Context to inspect
Inspect real input diversity, ambiguity, label confusion, length, languages, and sensitive patterns.

## Core knowledge
LLM-generated text can inherit generator biases, lexical shortcuts, and label leakage. Diversity must be semantic, not merely paraphrastic.

## Procedure
1. Define labels and boundary cases.
2. Build generation controls for intent, difficulty, language, style, and length.
3. Avoid exposing unnecessary real examples.
4. Generate independent batches with varied seeds/templates.
5. Detect duplicates and near-duplicates.
6. Check label leakage and unnatural artifacts.
7. Review hard/ambiguous samples.
8. Evaluate downstream utility on real held-out data.
9. Balance synthetic-to-real mixture experimentally.
10. Preserve provenance.

## Decision points
Use human-authored seeds for nuanced boundaries; use generation for scalable coverage, not as unquestioned ground truth.

## Common failure patterns
Template-like prose; labels named in text; unrealistic cleanliness; synthetic-only evaluation; duplicated paraphrases.

## Verification
Held-out real-data performance improves or remains within threshold, with diversity and leakage checks passing.

## Expected output
Versioned corpus, provenance, controls, and utility report.

## Stop conditions
Stop when labels are ambiguous, generated artifacts dominate, or privacy/licensing constraints are unresolved.