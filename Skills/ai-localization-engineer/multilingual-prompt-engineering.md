# Multilingual Prompt Engineering

## Purpose
Design and validate prompts that preserve task intent, control, safety, and output structure across languages instead of relying on literal prompt translation.

## When to use
Use when system prompts, tool instructions, extraction prompts, or generation policies must work in multiple languages.

## Inputs
Source prompts, target locales, model list, schemas, safety requirements, domain terminology, and evaluation cases.

## Preconditions
The original prompt behavior is understood and measurable.

## Context to inspect
Inspect prompt composition, hidden instructions, examples, output parsers, tool descriptions, model routing, and locale-specific policy layers.

## Core knowledge
Prompt equivalence is behavioral, not lexical. Languages differ in politeness, ambiguity, morphology, word order, and token cost. Translation can weaken constraints, examples, or structured-output reliability.

## Procedure
1. Define the invariant behavior the prompt must produce.
2. Separate semantic instructions from locale-specific wording.
3. Localize terminology using approved glossaries.
4. Adapt examples to the locale without changing policy intent.
5. Test structured outputs and tool calls per language.
6. Probe ambiguous, code-switched, and adversarial inputs.
7. Compare failure rates with the source-language baseline.
8. Version localized prompts independently when behavior requires it.

## Decision points
Use a shared multilingual prompt when behavior is stable across languages; use locale-specific variants when terminology, regulation, model quality, or safety differs materially.

## Common failure patterns
Literal translation, untranslated control tokens, examples that conflict culturally, English-only safety clauses, and assuming identical token budgets.

## Verification
Run locale-specific regression suites and compare instruction adherence, schema validity, refusal behavior, and task quality against agreed thresholds.

## Expected output
Validated prompt variants with provenance, evaluation evidence, and explicit locale-specific deviations.

## Stop conditions
Stop when model behavior is unstable enough that prompt changes cannot meet required safety or correctness thresholds.