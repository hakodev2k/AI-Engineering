# Speech Data Augmentation

## Purpose
Expand effective training coverage with controlled transformations that simulate plausible acoustic, channel, tempo, and speaking-condition variation without corrupting labels.

## When to use
Use when training data underrepresents production noise, reverberation, devices, speaking rates, codecs, or rare conditions.

## Inputs
- Training audio and labels
- Production acoustic profiles
- Candidate noise/RIR/codec resources
- Model training pipeline
- Validation sets segmented by condition

## Context to inspect
Inspect which production failures are caused by missing coverage versus model capacity, and whether transformations preserve transcript, speaker, timing, or other task labels.

## Core knowledge
Augmentation is useful only when it approximates plausible invariances. Speed perturbation, gain, additive noise, reverberation, masking, codec simulation, and channel transforms have different label-preservation assumptions. Excess augmentation can shift training away from real data.

## Procedure
1. Identify concrete production conditions missing from training.
2. Map each condition to a plausible augmentation.
3. Define safe parameter ranges from observed production distributions.
4. Keep clean examples in the mixture.
5. Validate label preservation for the target task.
6. Apply augmentations probabilistically and log parameters for reproducibility.
7. Run ablations for individual transforms and combinations.
8. Compare gains on matched noisy slices and losses on clean slices.
9. Monitor training stability and effective sample diversity.
10. Version augmentation policy with model artifacts.

## Decision points
Use waveform augmentation when acoustic realism matters; use feature masking for regularization when exact waveform simulation is unnecessary. Avoid pitch/formant changes for speaker identity tasks unless explicitly desired.

## Common failure patterns
- Arbitrary augmentation ranges
- Corrupting timestamps or speaker labels
- Training almost entirely on augmented audio
- Using unrealistic noise mixes
- Claiming gains without ablation

## Verification
Verify target-condition improvements, clean-condition regressions, label integrity, reproducibility, and distribution similarity between augmented and production slices.

## Expected output
A versioned augmentation policy with rationale, parameters, ablation evidence, and task-specific safety constraints.

## Stop conditions
Stop if transformations invalidate labels, degrade critical clean performance, or production conditions cannot be approximated credibly.