# Deep Time-Series Models

## Purpose
Design and evaluate neural sequence models for forecasting and temporal prediction when data scale and problem structure justify their complexity.

## When to use
Use for large multi-series datasets, long-range dependencies, high-dimensional covariates, representation learning, or multi-horizon outputs. Do not choose deep models solely because they are newer.

## Inputs
Sequence data, entity IDs, horizons, static/dynamic covariates, backtest protocol, compute and latency budgets.

## Context to inspect
Inspect sequence length, sampling regularity, missingness, number of series, seasonality, cold-start requirements, GPU availability, and inference mode.

## Core knowledge
RNN/LSTM/GRU, temporal convolutions, transformers, and modern forecasting architectures differ in receptive field, memory use, inductive bias, and scaling behavior. Normalization, masking, context windows, positional/time encoding, and horizon decoding are first-order design choices.

## Procedure
1. Prove simpler statistical or boosted baselines first.
2. Define context window and prediction horizon from domain dynamics.
3. Build masks for missing/padded observations.
4. Separate static, past-observed, and known-future covariates.
5. Select architecture based on sequence length, data scale, and latency.
6. Normalize per series or globally using training-only statistics.
7. Train with temporally valid batches and deterministic seeds where possible.
8. Monitor training loss, validation loss, gradient stability, and horizon-level metrics.
9. Regularize with dropout, weight decay, early stopping, or architecture constraints as justified.
10. Compare across multiple temporal folds and random seeds.
11. Profile memory, throughput, and inference latency.
12. Test cold-start and distribution-shift behavior.
13. Package preprocessing, masks, model, and postprocessing together.

## Decision points
Prefer transformers for long contexts and rich cross-series learning when compute allows; convolutions for efficient fixed receptive fields; recurrent models when streaming state and compactness matter. Use global models when cross-series transfer is valuable.

## Common failure patterns
Random splits, overly long context windows, unstable normalization, hidden leakage through future covariates, judging one seed, and ignoring serving cost.

## Verification
Verify backtest gains over strong baselines, seed stability, memory/latency budgets, masking behavior, cold-start handling, and training-serving parity.

## Expected output
A justified neural time-series model with architecture rationale, reproducible training configuration, evaluation evidence, and deployment profile.

## Stop conditions
Stop if gains are not robust over simpler models, sequence provenance is unclear, or compute/latency requirements violate production constraints.