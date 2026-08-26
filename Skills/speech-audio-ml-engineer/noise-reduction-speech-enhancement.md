# Noise Reduction and Speech Enhancement

## Purpose
Improve speech usability under noise, reverberation, and channel degradation without destroying task-relevant information.

## When to use
Use before ASR, communication, speaker tasks, or human listening when acoustic degradation is material.

## Inputs
Clean/noisy audio where available, noise conditions, downstream task, latency and artifact tolerance.

## Context to inspect
Inspect SNR, reverberation, stationary/nonstationary noise, microphones, existing DSP, and downstream sensitivity.

## Core knowledge
Enhancement can improve perceptual quality while harming recognition or speaker identity. Evaluate the actual downstream objective, not enhancement metrics alone.

## Procedure
1. Characterize degradation by environment.
2. Establish unenhanced downstream baseline.
3. Select DSP or neural enhancement proportional to constraints.
4. Tune conservatively on representative development audio.
5. Listen for musical noise, pumping, speech deletion, and phase artifacts.
6. Measure downstream quality and latency.
7. Test unseen noises and SNR ranges.

## Decision points
Use classical filtering for predictable low-cost conditions; neural enhancement for complex noise when data and compute justify it.

## Common failure patterns
Over-suppression, train-serving mismatch, synthetic-noise overfitting, optimizing PESQ/STOI while WER worsens, and excessive buffering.

## Verification
Compare downstream metrics, perceptual tests, SNR strata, and tail latency against raw-audio baseline.

## Expected output
An enhancement stage with demonstrated net benefit and bounded artifacts.

## Stop conditions
Stop when enhancement removes required speech cues or cannot satisfy real-time constraints.