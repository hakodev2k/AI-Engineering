# Audio Data Augmentation

## Purpose
Increase robustness by applying controlled, realistic audio transformations during training.

## When to use
Use when deployment conditions exceed training coverage or regularization is needed.

## Inputs
Training audio, deployment acoustic profile, model task, augmentation library, baseline errors.

## Context to inspect
Inspect real noise, reverberation, codec, gain, speed, device, and bandwidth distributions before inventing augmentations.

## Core knowledge
Augmentation encodes invariances. A transformation is valid only if it preserves the target label and approximates plausible deployment variation.

## Procedure
1. Identify robustness gaps from evaluation.
2. Map each gap to plausible transformations.
3. Define parameter distributions from real data where possible.
4. Apply augmentations only to training data.
5. Preserve deterministic evaluation.
6. Run single-factor ablations before complex policies.
7. Inspect transformed samples acoustically and perceptually.
8. Measure clean and degraded performance.

## Decision points
Prefer targeted augmentation to indiscriminate severity. Use simulation when real coverage is scarce, but retain real-condition validation.

## Common failure patterns
Label-breaking speed/pitch changes, unrealistic noise mixing, evaluation augmentation, excessive degradation, and stacked transforms that create impossible audio.

## Verification
Show robustness gains on held-out real conditions without unacceptable clean-set regression.

## Expected output
A reproducible augmentation policy tied to measured robustness needs.

## Stop conditions
Stop when transformations invalidate labels or no representative real-world validation exists.