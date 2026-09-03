# Modality Preprocessing Pipelines

## Purpose
Design reproducible preprocessing for text, image, audio, video, and document inputs so model behavior remains stable across training, evaluation, and production.

## When to use
Use when introducing new data sources, changing encoders, debugging train-serve skew, or optimizing input throughput.

## Inputs
Raw samples, model input specifications, tokenizers/processors, quality constraints, storage formats, latency targets.

## Preconditions
Know the target model family and which preprocessing steps are learned versus deterministic.

## Context to inspect
Inspect existing transforms, normalization, resizing, resampling, frame extraction, OCR, tokenization, augmentation, batching, and serving code.

## Core knowledge
Preprocessing is part of the model contract. Small differences in resize policy, color space, audio resampling, text normalization, frame selection, or truncation can create large distribution shifts.

## Procedure
1. Inventory every transform by modality.
2. Separate deterministic normalization from stochastic augmentation.
3. Define canonical dimensions, sample rates, codecs, and text normalization.
4. Specify truncation, padding, masking, and frame-selection policies.
5. Version processors with model artifacts.
6. Make transforms idempotent where practical.
7. Add validation before expensive model execution.
8. Implement deterministic evaluation mode.
9. Compare training and serving preprocessing byte-for-byte where possible.
10. Profile CPU, memory, I/O, and accelerator utilization.
11. Cache only safe deterministic intermediates.
12. Add regression fixtures for representative edge cases.

## Decision points
Prefer offline preprocessing for expensive immutable transforms. Prefer online transforms when raw inputs vary per request or freshness matters. Avoid lossy conversion unless the accuracy/cost trade-off is measured.

## Common failure patterns
Train-serve skew; inconsistent color channels; duplicated normalization; lossy transcoding; non-deterministic evaluation; silent truncation; excessive CPU preprocessing that starves accelerators.

## Verification
Reprocess fixed fixtures in training and serving paths, compare outputs, run model regression tests, and profile end-to-end latency.

## Expected output
A versioned, benchmarked preprocessing pipeline with deterministic fixtures and explicit modality policies.

## Stop conditions
Stop when model input semantics are undocumented, source quality cannot meet minimum requirements, or preprocessing changes invalidate prior evaluation without a re-baseline.