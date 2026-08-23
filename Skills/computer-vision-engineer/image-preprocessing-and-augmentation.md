# Image Preprocessing and Augmentation

## Purpose
Build reproducible preprocessing and augmentation pipelines that improve generalization without corrupting task semantics.

## When to use
Use when preparing training inputs, addressing domain variability, or diagnosing training-serving skew.

## Inputs
Raw image/video formats, model input contract, target domain, calibration data.

## Preconditions
Task invariances and sensor characteristics are understood.

## Context to inspect
Color space, resize policy, normalization, aspect ratio, compression, camera artifacts, runtime preprocessing.

## Core knowledge
Transformations must preserve labels and match production semantics. Aggressive augmentation can create impossible samples or hide data problems.

## Procedure
1. Reproduce production decoding and color conversion.
2. Define resize/crop/pad behavior.
3. Establish normalization from model requirements.
4. Map realistic nuisance factors.
5. Add augmentations one family at a time.
6. Apply geometry consistently to labels.
7. Track random seeds and configs.
8. Run ablations and inspect samples.

## Decision points
Offline vs online augmentation; fixed resize vs letterbox; synthetic corruption vs real hard-example collection.

## Common failure patterns
RGB/BGR mismatch, label-transform bugs, train-only preprocessing, unrealistic flips/crops, excessive augmentation.

## Verification
Pixel-level parity tests, visual audits, ablations, and production sample comparison.

## Expected output
Versioned preprocessing contract, augmentation configuration, tests, and evidence of benefit.

## Stop conditions
Stop when transformations alter required semantics or parity with production cannot be established.