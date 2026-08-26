# Multilingual Speech Modeling

## Purpose
Build speech models that serve multiple languages without hiding low-resource regressions behind aggregate performance.

## When to use
Use for multilingual ASR, TTS, embeddings, language identification, or shared acoustic encoders.

## Inputs
Language-tagged corpora, scripts, tokenizers, phonetic resources, traffic priors, per-language targets.

## Context to inspect
Inspect hours, speakers, domains, scripts, code-switching, label conventions, and language imbalance.

## Core knowledge
Shared models enable transfer but can create negative transfer and capacity competition. Tokenization and text normalization strongly affect cross-language results.

## Procedure
1. Define supported languages and minimum quality per language.
2. Audit data and normalization separately for each language.
3. Choose shared versus language-specific frontend components.
4. Design sampling/weighting to prevent dominant-language collapse.
5. Train a reproducible baseline.
6. Evaluate each language and code-switching separately.
7. Inspect negative transfer and capacity limits.
8. Add adapters or specialization only where evidence supports it.

## Decision points
Use shared models for transfer and operational simplicity; use adapters/specialized models when interference or script/phonology differences dominate.

## Common failure patterns
Macro metrics hiding failures, incorrect language tags, script normalization bugs, tokenizer starvation, and evaluating only high-resource languages.

## Verification
Report per-language and macro metrics, low-resource deltas, code-switch tests, latency, and model size.

## Expected output
A multilingual design with explicit coverage, balancing strategy, and per-language evidence.

## Stop conditions
Escalate when a claimed supported language lacks sufficient evaluation or expert validation.