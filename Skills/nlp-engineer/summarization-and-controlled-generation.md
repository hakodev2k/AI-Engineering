# Summarization and Controlled Generation

## Purpose
Produce concise generated text that preserves source meaning, satisfies format constraints, and minimizes unsupported claims.

## When to use
Use for document summaries, meeting notes, report synthesis, rewriting, or bounded content generation.

## Inputs
Source text, audience, required facts, format/length constraints, prohibited content, evaluation examples.

## Preconditions
The desired summary scope and acceptable abstraction level are defined.

## Context to inspect
Source lengths, document structure, factual density, contradictory passages, model context limits, prior hallucination examples.

## Core knowledge
Summarization quality includes coverage, faithfulness, relevance, coherence, and compression. Fluent text may still contradict or invent source claims.

## Procedure
1. Define summary purpose and must-include information.
2. Choose extractive, abstractive, or hybrid approach.
3. Segment long inputs by semantic structure when needed.
4. Preserve source attribution for disputed or high-risk claims.
5. Constrain output format, length, and unsupported inference.
6. Evaluate coverage and factual consistency separately from style.
7. Test conflicting, sparse, repetitive, and long sources.
8. Add deterministic checks for required fields where possible.
9. Set refusal or caveat behavior when evidence is insufficient.
10. Measure cost and latency on realistic document lengths.

## Decision points
Prefer extractive methods for high-stakes factual fidelity; abstractive methods when compression and readability justify additional validation.

## Common failure patterns
Evaluating only with lexical overlap, summarizing beyond context limits, dropping minority viewpoints, inventing causal claims, and failing to distinguish source fact from interpretation.

## Verification
Human or reference-based faithfulness checks, required-fact coverage, format validation, and adversarial long-document tests pass.

## Expected output
Generation pipeline, summary contract, evaluation rubric, regression set, and operating limits.

## Stop conditions
Stop when required fidelity cannot be demonstrated or source contradictions require domain-owner adjudication.