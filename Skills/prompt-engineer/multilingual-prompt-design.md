# Multilingual Prompt Design

## Purpose
Design prompts that preserve task semantics, safety, formatting, and terminology across languages and locales.

## When to use
Use for multilingual products, translation-adjacent workflows, international support, and mixed-language inputs.

## Inputs
Supported locales, terminology/glossaries, representative inputs, output-language policy, cultural constraints, and evals.

## Context to inspect
Inspect real language distribution, code-switching, locale-specific formats, model capability by language, and existing translated prompts.

## Core knowledge
Literal translation of a prompt does not guarantee equivalent behavior. Language capability, morphology, honorifics, ambiguity, locale formats, and safety behavior can vary.

## Procedure
1. Define language detection and output-language rules.
2. Identify terminology that must remain untranslated.
3. Prefer semantic prompt adaptation over blind literal translation.
4. Specify locale-sensitive dates, numbers, units, and names.
5. Test code-switching and mixed scripts.
6. Include native-speaker review for high-impact locales.
7. Build equivalent eval slices per supported language.
8. Test safety and injection cases in each language family.
9. Compare performance gaps against the primary language.
10. Document unsupported or degraded locales explicitly.

## Decision points
Use one multilingual prompt when behavior remains equivalent; locale-specific variants when terminology or cultural conventions materially differ. Avoid automatic language detection when the product already knows locale reliably.

## Common failure patterns
English-only evals; accidental translation of code/product names; locale formatting errors; assuming safety behavior transfers; translating examples that no longer represent natural language.

## Verification
Native-language evaluations meet task, format, safety, and terminology thresholds, including mixed-language edge cases.

## Expected output
Language policy, prompt variants where justified, terminology rules, and multilingual eval coverage.

## Stop conditions
Stop if a target language lacks competent review for a high-risk workflow or model performance is below the approved threshold.