# Preprocessing and Augmentation

## Purpose
Design input transformations and augmentations that improve generalization without corrupting label semantics or creating training-serving skew.

## When to use
Use when building training pipelines, adapting to new capture conditions, investigating overfitting, or improving robustness to nuisance variation.

## Inputs
Raw media, model input contract, label geometry, production capture statistics, current error slices, and compute budget.

## Preconditions
The task's invariances and non-invariances are understood well enough to judge whether a transformation preserves meaning.

## Context to inspect
Inspect resize/crop policy, aspect ratios, color spaces, normalization, EXIF orientation, video sampling, label-coordinate transforms, and inference preprocessing.

## Core knowledge
Augmentation encodes assumptions about invariance. Geometric transforms must update boxes, masks, keypoints, and tracks consistently. Strong augmentations can improve robustness while shifting the training distribution away from real data.

## Procedure
1. Reproduce the exact production input path.
2. Define canonical decoding, orientation, color, and resize behavior.
3. Identify nuisance factors the model should ignore.
4. Identify transformations that would change label meaning.
5. Add augmentations one family at a time.
6. Apply geometry-aware transformations to annotations.
7. Check transformed samples visually and programmatically.
8. Measure effect on overall and slice-level validation metrics.
9. Compare training speed and memory impact.
10. Test inference preprocessing parity separately.
11. Run ablations for expensive or aggressive augmentations.
12. Version preprocessing with the model artifact.

## Decision points
Prefer letterboxing when preserving full field of view matters; crop when irrelevant context can be removed safely. Use photometric augmentation for lighting/device variation; synthetic occlusion only when it resembles credible deployment conditions.

## Common failure patterns
Train-serving resize mismatch, incorrect box transforms, augmenting validation data, excessive cropping of small targets, accidental RGB/BGR mismatch, and transformations that destroy OCR or fine-grained cues.

## Verification
Verify deterministic inference preprocessing, label-transform tests, visual sample audits, ablation evidence, and parity between exported model inputs and training inputs.

## Expected output
A versioned preprocessing/augmentation pipeline with documented invariance assumptions and measured impact.

## Stop conditions
Stop if transformations invalidate labels, production preprocessing cannot be reproduced, or quality improvements exist only on unrealistic augmented slices.