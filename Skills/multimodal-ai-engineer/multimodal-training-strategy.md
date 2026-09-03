# Multimodal Training Strategy

## Purpose
Plan staged multimodal training so modality encoders, fusion layers, objectives, data mixtures, and compute budgets evolve deliberately instead of being tuned through uncontrolled experimentation.

## When to use
Use when training or adapting multimodal foundation models, cross-modal encoders, or task-specific multimodal networks.

## Inputs
Model architecture, pretrained checkpoints, datasets, modality balance, objectives, compute budget, target metrics.

## Preconditions
Have validated datasets, legal permission to train on them, and a clear baseline for each modality.

## Context to inspect
Inspect checkpoint compatibility, optimizer settings, sampling ratios, sequence lengths, augmentation, data quality, loss scales, distributed-training topology, and evaluation cadence.

## Core knowledge
Multimodal training can suffer from dominant modalities, gradient imbalance, catastrophic forgetting, representation collapse, and mismatched data quality. Staged freezing/unfreezing and objective weighting can improve stability, but must be validated rather than assumed.

## Procedure
1. Establish unimodal and simple-fusion baselines.
2. Define training stages and which modules are frozen.
3. Set modality sampling ratios from data quality and task importance.
4. Define objective weights and normalization.
5. Choose precision, batch size, accumulation, and checkpoint cadence.
6. Instrument per-modality losses and gradient norms.
7. Run small-scale stability experiments first.
8. Detect dominance or forgetting through ablations.
9. Scale compute only after loss and evaluation behavior are understood.
10. Evaluate at fixed checkpoints on stable holdouts.
11. Record data, code, processor, and model versions.
12. Define rollback criteria for degraded modalities.

## Decision points
Freeze mature encoders when data is limited or compute constrained; jointly fine-tune when cross-modal interaction needs adaptation. Rebalance sampling when a large but low-quality modality overwhelms useful signal.

## Common failure patterns
Scaling before debugging; mixing incompatible checkpoints; untracked data mixtures; one modality dominating gradients; evaluating only aggregate loss; forgetting pretrained capabilities.

## Verification
Confirm reproducibility from a checkpoint, compare modality-specific and joint metrics, inspect training stability, and run ablations before accepting gains.

## Expected output
A staged training plan with objectives, data mixture, instrumentation, checkpoints, evaluation gates, and rollback criteria.

## Stop conditions
Stop when data provenance is unresolved, training is numerically unstable after controlled debugging, or compute scaling is unsupported by validated small-run evidence.