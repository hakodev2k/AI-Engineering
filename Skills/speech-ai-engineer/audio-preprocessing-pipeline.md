# Audio Preprocessing Pipeline

## Purpose
Design reproducible preprocessing that preserves task-relevant speech information while normalizing avoidable recording variability.

## When to use
Use when preparing audio for training or inference, standardizing heterogeneous sources, or investigating train/serve mismatch.

## Inputs
- Audio formats and sample rates
- Model frontend requirements
- Target deployment environment
- Existing preprocessing code
- Representative audio samples

## Context to inspect
Inspect resampling, channel selection, gain, clipping, silence handling, segmentation, codec artifacts, normalization, and whether preprocessing differs between offline training and production.

## Core knowledge
Preprocessing can alter phonetic content, speaker characteristics, timing, and noise statistics. Every transformation should have a task-specific reason. Train/serve skew in resampling, normalization, or segmentation can materially degrade models.

## Procedure
1. Determine model-required waveform format and sample rate.
2. Profile source formats and edge cases.
3. Define deterministic decoding and resampling.
4. Decide channel mixing or selection rules.
5. Detect clipping, corrupt files, excessive silence, and pathological durations.
6. Apply amplitude normalization only when justified.
7. Define segmentation with boundary handling and overlap if needed.
8. Preserve timestamps through transformations.
9. Implement identical or explicitly compatible inference preprocessing.
10. Add unit tests for representative and adversarial audio cases.
11. Benchmark preprocessing latency and CPU cost.

## Decision points
Do not denoise by default; it may remove speech cues. Use fixed segmentation for batch throughput only when boundaries do not harm labels. Preserve multichannel audio when spatial information matters.

## Common failure patterns
- Different resamplers in training and serving
- Aggressive silence trimming that cuts phonemes
- Incorrect channel averaging
- Hidden lossy re-encoding
- Timestamp drift after resampling

## Verification
Compare waveforms, durations, timestamps, and model outputs before/after processing. Run train/serve parity tests and inspect edge-case audio manually.

## Expected output
A deterministic preprocessing specification, implementation, tests, and documented transformation rationale.

## Stop conditions
Stop if preprocessing would irreversibly remove information required by downstream tasks or source decoding is unreliable.