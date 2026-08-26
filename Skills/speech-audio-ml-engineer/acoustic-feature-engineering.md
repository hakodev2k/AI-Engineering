# Acoustic Feature Engineering

## Purpose
Select and implement acoustic representations appropriate to a speech/audio task.

## When to use
Use when designing classical pipelines, diagnosing learned representations, or constraining compute and latency.

## Inputs
Waveforms, model architecture, task, latency budget, target hardware, baseline metrics.

## Context to inspect
Inspect current frontend, sample rate, frame settings, normalization, augmentation, and train-serving parity.

## Core knowledge
Relevant representations include log-mel spectra, MFCCs, pitch, energy, spectral descriptors, learned filterbanks, and raw-waveform encoders. Window and hop sizes trade temporal against frequency resolution.

## Procedure
1. Identify information required by the task.
2. Establish a raw or standard log-mel baseline.
3. Choose frame, window, frequency range, and normalization deliberately.
4. Test invariances such as loudness or channel normalization.
5. Benchmark representation cost and model quality.
6. Inspect feature distributions across cohorts.
7. Implement identical training and inference transforms.

## Decision points
Prefer learned representations when data and compute support them; prefer engineered features when interpretability, low compute, or small data dominates.

## Common failure patterns
Feature leakage, inconsistent normalization, inappropriate sample-rate assumptions, excessive dimensionality, and offline/online transform mismatch.

## Verification
Unit-test transforms, compare deterministic fixtures, profile latency, and run ablations against baseline.

## Expected output
A justified, tested feature pipeline with measured quality and cost.

## Stop conditions
Stop when required signal information is absent from the source audio or inference constraints cannot support the representation.