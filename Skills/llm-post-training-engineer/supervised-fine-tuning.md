# Supervised Fine-Tuning

## Purpose
Plan, execute, and validate supervised fine-tuning (SFT) that reliably teaches target response behavior without unnecessary capability loss.

## When to use
Use when demonstrations can directly express desired behavior, when adapting format/style/domain behavior, or as a stable initialization before preference optimization. Do not use SFT alone for preferences that are easier to express comparatively than demonstratively.

## Inputs
- Base checkpoint and tokenizer
- Curated instruction dataset
- Objective and preservation metrics
- Compute budget and distributed-training environment
- Training/evaluation harness

## Preconditions
Dataset quality and provenance are reviewed, checkpoint compatibility is confirmed, and reproducible baseline evaluations exist.

## Context to inspect
Review model architecture, context length, optimizer defaults, precision, packing strategy, masking rules, chat template, special tokens, previous learning-rate sensitivity, and infrastructure limits.

## Core knowledge
SFT changes the conditional distribution through next-token likelihood. Learning rate, effective batch size, sequence packing, token weighting, and number of epochs materially affect forgetting and overfitting. Loss reduction is not evidence of behavioral improvement. Correct prompt/response masking and template consistency are essential because subtle preprocessing errors can dominate training.

## Procedure
1. Reproduce baseline evaluations from the exact starting checkpoint.
2. Validate tokenization, templates, labels, padding, truncation, and loss masks on representative samples.
3. Estimate token counts and effective batch size.
4. Choose a conservative learning-rate range and checkpoint cadence.
5. Run a short smoke test and confirm finite loss, expected memory use, and gradient flow.
6. Inspect decoded training batches rather than trusting preprocessing code alone.
7. Run a small hyperparameter sweep when the model or data regime is new.
8. Track training/validation loss plus behavioral evaluations during training.
9. Save checkpoints early enough to detect an optimum before overtraining.
10. Compare candidate checkpoints on target, safety, and preservation slices.
11. Investigate regressions by data slice before increasing training duration.
12. Re-run deterministic or low-variance evaluations on finalists.
13. Record data version, code revision, hyperparameters, seeds, and environment.

## Decision points
- Use full-parameter tuning when maximum adaptation quality justifies cost; use parameter-efficient tuning when isolation, iteration speed, or memory efficiency matters more.
- Increase epochs only when target behavior remains underfit and preservation metrics are stable.
- Prefer lower learning rates for already capable base models where preserving general behavior is important.

## Common failure patterns
Incorrect loss masking; train/serve chat-template mismatch; excessive epochs; checkpoint selection by training loss; silent truncation of long examples; unstable mixed precision; dataset ordering artifacts; failure to evaluate base-model regressions.

## Verification
Confirm reproducibility of a short run, inspect decoded batches, validate checkpoint loading in the inference stack, and compare the selected checkpoint against the base on target and preservation metrics with confidence intervals where appropriate.

## Expected output
A reproducible SFT checkpoint plus training report containing data/version lineage, hyperparameters, evaluation comparisons, regressions, and selection rationale.

## Stop conditions
Stop for non-finite training, unexplained preprocessing mismatch, persistent regression in protected capabilities, corrupted checkpoints, or resource behavior inconsistent with the validated plan.