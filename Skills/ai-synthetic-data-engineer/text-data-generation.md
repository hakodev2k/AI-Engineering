# Text Data Generation

## Purpose
Generate synthetic text corpora that improve training, evaluation, safety testing, or domain coverage while controlling quality, diversity, privacy, and label consistency.

## When to use
Use for instruction data, classification examples, conversations, extraction tasks, domain text, rare intents, adversarial cases, or test corpora when real text is limited or sensitive.

## Inputs
Task definition, label taxonomy, source examples, style/domain constraints, safety policy, target distribution, generator model, evaluation rubric.

## Preconditions
Source material is authorized for use and sensitive information handling requirements are defined.

## Context to inspect
Prompt templates, label definitions, real text distribution, vocabulary, length, language/locale, known model errors, prohibited content, deduplication rules.

## Core knowledge
LLM-generated corpora can exhibit repetitive phrasing, generator fingerprints, label leakage, factual fabrication, mode collapse, and self-training feedback loops. Diversity and correctness must be measured, not assumed.

## Procedure
1. Define the downstream behavior each sample should teach or test.
2. Build generation prompts from explicit schemas and label definitions.
3. Vary scenarios, personas, linguistic style, difficulty, and length intentionally.
4. Constrain outputs with structured formats where possible.
5. Generate in batches with recorded model, prompt, seed/settings, and timestamp.
6. Validate schema and remove malformed samples.
7. Detect duplicates, near-duplicates, template artifacts, and label leakage.
8. Score semantic quality and task consistency using deterministic checks, model judges, and human review where risk warrants.
9. Compare linguistic and semantic coverage with real data.
10. Validate downstream benefit on independent real examples.

## Decision points
Use deterministic templates for exact control, LLMs for semantic variation, and hybrid generation when both are required. Increase human review for high-risk domains or weak automatic validators.

## Common failure patterns
Generating thousands of paraphrases of a few examples, embedding labels in obvious lexical cues, accepting fluent but incorrect examples, and evaluating synthetic text only with the same generator family.

## Verification
Confirm diversity, label consistency, privacy safety, format compliance, and measurable downstream improvement on real holdout data.

## Expected output
A versioned synthetic text dataset plus generation metadata and quality/utility evidence.

## Stop conditions
Stop when sensitive content appears unexpectedly, label ambiguity cannot be resolved, or synthetic examples reduce real-world validation performance.