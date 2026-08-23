# Tokenization and Text Normalization

## Purpose
Design text preprocessing that preserves task-relevant meaning while producing stable model inputs across languages and noisy production text.

## When to use
Use when choosing or changing tokenizers, normalizers, segmentation, Unicode handling, or input truncation.

## Inputs
Representative text, target languages, model tokenizer, context limits, task metrics, production input examples.

## Preconditions
Raw-input characteristics and model constraints are known.

## Context to inspect
Unicode forms, scripts, whitespace, markup, URLs, emojis, casing, code-switching, sentence boundaries, token-length distribution.

## Core knowledge
Normalization can destroy meaning. Tokenization controls sequence length, unknown/fragmented terms, multilingual coverage, cost, and truncation behavior.

## Procedure
1. Sample clean and adversarial production text.
2. Inspect Unicode and script behavior.
3. Measure token counts by language/domain.
4. Identify transformations required for the task only.
5. Define casing, punctuation, whitespace, markup, URL, emoji, and number policies.
6. Choose truncation/chunking based on semantic boundaries.
7. Test domain terms, names, identifiers, and code-switching.
8. Version preprocessing with the model.
9. Compare downstream metrics before and after changes.

## Decision points
Preserve raw form when typography or casing carries signal. Normalize when variation is semantically irrelevant and harms robustness. Prefer model-native tokenization unless evidence supports custom behavior.

## Common failure patterns
ASCII-only assumptions, destructive lowercasing, inconsistent train/serve preprocessing, truncating critical suffixes, and ignoring token expansion in non-English text.

## Verification
Round-trip examples, token-length distributions, multilingual slices, and downstream regression tests pass.

## Expected output
Versioned preprocessing contract, tokenizer configuration, edge-case tests, and measured impact.

## Stop conditions
Stop if normalization changes legally or semantically significant content or tokenizer compatibility with the deployed model is uncertain.