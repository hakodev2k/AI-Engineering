# Supervised Fine-Tuning

## Purpose
Train instruction-following or task behavior from curated input-output examples while preserving base capabilities and safety boundaries.

## When to use
Use when desired behavior can be demonstrated directly with high-quality supervised examples.

## Inputs
Base model, SFT dataset, chat/template format, tokenizer, target evaluations, safety tests, compute budget.

## Context to inspect
Conversation formatting, loss masks, example quality, domain balance, duplicate prompts, response style, truncation, and base-model regressions.

## Core knowledge
SFT quality is highly sensitive to label quality and formatting. Training loss on responses does not measure helpfulness. Masking and chat-template mismatches can silently train the wrong tokens.

## Procedure
1. Define desired behaviors and explicit non-goals.
2. Audit examples for correctness, diversity, provenance and safety.
3. Freeze prompt/chat serialization and special tokens.
4. Unit-test loss masks on representative examples.
5. Split evaluations to prevent prompt leakage.
6. Train conservative pilots across LR/epoch choices.
7. Evaluate instruction following, domain tasks, safety and base regressions.
8. Inspect qualitative failures by slice.
9. Select checkpoint using predefined gates rather than minimum train loss.
10. Record dataset and template versions.

## Decision points
Prefer fewer expert examples over noisy volume when label quality dominates. Use parameter-efficient tuning when deployment/storage constraints favor adapters and full tuning is unnecessary. Use full tuning when broad parameter adaptation is justified and validated.

## Common failure patterns
Training on prompt tokens unintentionally; duplicated templates; overfitting style; evaluation prompts present in training; excessive epochs on small data.

## Verification
Mask tests pass, held-out evaluations improve, base/safety guardrails hold, and sample conversations confirm intended behavior across slices.

## Expected output
A reproducible SFT checkpoint/adapters, recipe, dataset manifest, and evaluation report.

## Stop conditions
Stop for label provenance issues, safety regression, formatting ambiguity, or clear overfitting.