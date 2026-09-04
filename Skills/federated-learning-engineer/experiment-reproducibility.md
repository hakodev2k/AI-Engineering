# Federated Experiment Reproducibility

## Purpose
Make federated experiments reproducible enough to distinguish real algorithmic improvements from client sampling noise, data partition differences, and infrastructure variation.

## When to use
Use for algorithm comparisons, hyperparameter tuning, publication-quality studies, production promotion decisions, or regression analysis.

## Inputs
Code revision, model config, optimizer settings, client partitions, random seeds, sampling policy, simulator/runtime versions, privacy parameters, and infrastructure metadata.

## Context to inspect
Inspect all sources of nondeterminism: client selection, data shuffling, initialization, asynchronous execution, accelerator kernels, retries, and evolving client data.

## Core knowledge
Exact bitwise reproducibility may be impractical in distributed ML; the Senior goal is controlled provenance plus statistical reproducibility. Results should survive repeated client samples and seeds, not just one lucky run.

## Procedure
1. Version code, dependencies, model architecture, protocol, and data-partition logic.
2. Record all hyperparameters and privacy parameters.
3. Seed initialization, client sampling, and local shuffling where feasible.
4. Snapshot or fingerprint evaluation datasets and simulator inputs.
5. Record effective client participation and dropout.
6. Run multiple seeds for important comparisons.
7. Report confidence intervals or distribution summaries.
8. Keep training and evaluation selection policies fixed across comparisons.
9. Archive checkpoints and machine-readable run metadata.
10. Reproduce the winning configuration from a clean environment before promotion.

## Decision points
Prefer statistical reproducibility over expensive deterministic kernels unless exact reproducibility is required. Freeze client traces for controlled experiments, then validate on live-like stochastic traces separately.

## Common failure patterns
- Saving only final metrics.
- Different client samples across algorithm comparisons.
- Untracked data partition changes.
- One-seed conclusions.
- Hidden runtime defaults change between runs.

## Verification
A clean rerun should reconstruct configuration and produce results within predefined statistical tolerance across repeated seeds.

## Expected output
A reproducible experiment package containing provenance, configs, seeds, client-selection evidence, checkpoints, metrics, and comparison methodology.

## Stop conditions
Stop if essential data/version provenance is unavailable or results cannot be distinguished from stochastic variance.