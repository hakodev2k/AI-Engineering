# Preprocessing and Augmentation Rules

## Purpose
Keep transformations semantically valid and consistent between experimentation and production.

## Scope
Resize, crop, normalization, color conversion, geometric transforms, compression, augmentation, and sensor preprocessing.

## MUST
- Production preprocessing MUST match the evaluated pipeline in ordering, parameters, coordinate conventions, and numeric behavior.
- Augmentations MUST preserve labels or update labels geometrically and semantically as required.
- Transform parameters and randomness MUST be reproducible for debugging.
- Preprocessing changes MUST trigger compatibility and regression evaluation.

## MUST NOT
- Augmentations MUST NOT introduce impossible samples that materially distort the target distribution without explicit experimental justification.
- Hidden framework defaults MUST NOT be relied upon for critical preprocessing semantics.

## SHOULD
- Augmentation strength SHOULD be justified by expected deployment variation and ablation evidence.

## Exceptions
Deliberate domain randomization requires documented target shifts, validation evidence, and failure analysis.

## Verification
Compare training and serving transforms, golden-image outputs, coordinate tests, augmentation visualizations, and regression metrics.