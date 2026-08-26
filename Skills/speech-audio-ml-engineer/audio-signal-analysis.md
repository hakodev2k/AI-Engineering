# Audio Signal Analysis

## Purpose
Analyze speech and audio signals before modeling so representation, defects, and constraints are understood.

## When to use
Use when onboarding a dataset, diagnosing model failures, or selecting preprocessing. Do not assume waveform quality from metadata alone.

## Inputs
Audio samples, metadata, task requirements, sample rates, channel layout, and representative failure cases.

## Context to inspect
Inspect codecs, bit depth, clipping, silence, loudness, SNR, duration distribution, channel consistency, and acquisition conditions.

## Core knowledge
Understand sampling theory, aliasing, quantization, PCM, spectrograms, STFT, frequency resolution, phase, loudness, SNR, and common acoustic artifacts.

## Procedure
1. Define the downstream task and quality criteria.
2. Validate file readability and metadata.
3. Measure duration, sample-rate, channel, loudness, clipping, and silence distributions.
4. Inspect waveforms and spectrograms for representative and anomalous samples.
5. Segment findings by device, environment, language, speaker, and source when available.
6. Identify transformations that are necessary rather than merely conventional.
7. Preserve raw data and make preprocessing reproducible.
8. Record assumptions and risks.

## Decision points
Resample only when model or pipeline requirements justify it. Downmix stereo only when spatial information is irrelevant. Prefer reversible normalization where possible.

## Common failure patterns
Silent corruption, mislabeled sample rates, clipping, aggressive denoising, train-serving preprocessing skew, and aggregate metrics hiding subgroup defects.

## Verification
Re-run measurements after preprocessing, listen to sampled outputs, compare spectrograms, and confirm downstream evaluation does not regress.

## Expected output
A reproducible audio-quality assessment and justified preprocessing specification.

## Stop conditions
Escalate when source corruption is unrecoverable, licensing is unclear, or transformations would destroy information required by the task.