# Synthetic Data Quality Validation

## Purpose
Assess whether synthetic data is useful, realistic enough for its intended purpose, and safe to combine with real AI training or evaluation data.

## When to use
Use when synthetic examples augment rare classes, bootstrap testing, reduce collection cost, or simulate edge cases.

## Inputs
Synthetic dataset, generation method, reference real data, intended use, model metrics, scenario definitions, sampling strategy.

## Preconditions
Synthetic and real records can be distinguished and the intended role of synthetic data is explicit.

## Context to inspect
Generator prompts or models, source examples, filtering, class targets, duplication risk, downstream weighting, split construction.

## Core knowledge
Synthetic data can amplify generator bias, duplicate source material, collapse diversity, or create unrealistic shortcuts. Fitness depends on intended use; data adequate for pipeline testing may be inadequate for model training.

## Procedure
1. Define the exact purpose of synthetic data.
2. Compare feature and label distributions with reference data.
3. Measure diversity and duplicate or near-duplicate rates.
4. Review realism on representative samples.
5. Check coverage of targeted rare scenarios.
6. Test for artifacts that models could exploit as shortcuts.
7. Evaluate models with and without synthetic augmentation.
8. Keep evaluation sets independent from synthetic generation inputs.
9. Version synthetic data and generation configuration.
10. Monitor downstream performance by real versus synthetic exposure.

## Decision points
Use synthetic data for targeted augmentation when it provides measured benefit. Prefer real data for unknown operating regimes and final unbiased evaluation.

## Common failure patterns
Assuming realism from visual inspection, using the same generator for training and evaluation, hiding synthetic provenance, and overwhelming real data with generated examples.

## Verification
Synthetic data adds measurable value without degrading real-world evaluation or introducing detectable shortcut artifacts.

## Expected output
A fitness assessment, approved use boundaries, generation version, and comparative evaluation evidence.

## Stop conditions
Stop when provenance cannot be established or synthetic generation contaminates the evaluation set.