# Tokenizer Design and Validation

## Purpose
Select or build a tokenizer that supports target languages, code, structured text, and model efficiency without introducing avoidable fragmentation.

## When to use
Use when training a model family from scratch, expanding language/domain coverage, or diagnosing tokenization-driven inefficiency.

## Inputs
Representative corpora, target vocabulary size, model architecture constraints, special-token requirements, baseline tokenizer and serving stack.

## Context to inspect
Tokens-per-character/word by slice, byte fallback behavior, normalization, whitespace/code handling, special-token semantics, embedding compatibility, and inference implementation.

## Core knowledge
Tokenizer choices affect sequence length, compute, multilingual fairness, code representation, embedding size, and compatibility. Changing a tokenizer on an existing checkpoint generally requires embedding adaptation and careful validation.

## Procedure
1. Sample representative multilingual/domain data.
2. Define normalization and special tokens explicitly.
3. Train candidate tokenizers with fixed data snapshots.
4. Compare compression efficiency by slice.
5. Inspect pathological segmentations, control characters, code and numeric text.
6. Validate encode/decode round trips.
7. Test special-token collision and injection behavior.
8. Estimate training and inference cost impact.
9. Verify identical behavior across training and serving implementations.
10. Freeze tokenizer artifacts with checksums.

## Decision points
Prefer compatibility when extending an existing model unless gains justify migration complexity. Increase vocabulary only when sequence savings outweigh embedding/output-layer cost. Use byte fallback when robust unknown-character handling is required.

## Common failure patterns
Evaluating only English; inconsistent Unicode normalization; special tokens appearing in ordinary text; training/serving tokenizer drift; assuming larger vocabulary is always better.

## Verification
Round-trip tests pass, slice compression is quantified, special tokens behave as specified, and training/serving token IDs match exactly.

## Expected output
Versioned tokenizer artifacts, validation report, compatibility constraints, and cost analysis.

## Stop conditions
Stop on irreconcilable serving incompatibility, unstable special-token semantics, or severe regression on required languages/domains.