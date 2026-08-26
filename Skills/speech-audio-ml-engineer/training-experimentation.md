# Speech Model Training and Experimentation

## Purpose
Run controlled speech-model experiments that produce reproducible evidence rather than configuration folklore.

## When to use
Use for training new models, hyperparameter studies, architecture comparisons, or data ablations.

## Inputs
Versioned data, code, model configuration, compute budget, baseline, evaluation protocol.

## Context to inspect
Inspect seeds, data manifests, preprocessing, checkpointing, optimizer/scheduler, distributed setup, mixed precision, and experiment tracking.

## Core knowledge
Speech training is sensitive to sequence lengths, batching, augmentation, normalization, optimizer dynamics, and data mixtures. Reproducibility requires recording data and environment, not only hyperparameters.

## Procedure
1. State hypothesis and success metric.
2. Reproduce baseline first.
3. Change the minimum variables needed.
4. Record code, data, environment, seed, and config identifiers.
5. Monitor loss, gradients, throughput, memory, and validation metrics.
6. Detect divergence or data-loader anomalies early.
7. Evaluate checkpoints with fixed protocol.
8. Repeat material gains when variance could explain them.

## Decision points
Scale compute only after small experiments validate direction. Use gradient accumulation when memory-limited, but account for effective batch and optimizer behavior.

## Common failure patterns
Unreproducible data ordering, hidden preprocessing changes, comparing unequal compute budgets, selecting on test data, and keeping only successful runs.

## Verification
Baseline reproduces, run metadata is complete, and claimed gain survives frozen evaluation and appropriate repeat checks.

## Expected output
Traceable experiment artifacts and a defensible conclusion.

## Stop conditions
Stop runaway experiments on divergence, corrupted data, invalid metrics, or budget breach.