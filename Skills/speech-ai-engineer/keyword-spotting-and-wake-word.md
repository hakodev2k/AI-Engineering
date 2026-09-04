# Keyword Spotting and Wake Word

## Purpose
Design low-latency detectors for fixed phrases or commands with controlled false accepts and misses in continuous audio.

## When to use
Use for wake words, hands-free triggers, fixed command vocabularies, or always-listening edge experiences where full ASR is unnecessary.

## Inputs
- Positive phrase recordings
- Hard negatives and background audio
- Device/microphone constraints
- False-accept and false-reject targets
- Power and latency budgets

## Context to inspect
Inspect pronunciation variants, accents, near-homophones, playback audio, far-field use, background media, device noise, and always-on resource limits.

## Core knowledge
Keyword spotting is dominated by operating-point trade-offs and hard-negative coverage. Aggregate accuracy is misleading because production audio is overwhelmingly negative. False accepts per hour and miss rate at realistic priors are more useful.

## Procedure
1. Define trigger phrase and acceptable variants.
2. Collect positives across speakers, devices, distances, and environments.
3. Build hard negatives including phonetic confusions and media playback.
4. Select compact architecture suitable for target hardware.
5. Tune windowing, stride, smoothing, and trigger threshold.
6. Measure false accepts over long background recordings.
7. Measure misses by subgroup and acoustic condition.
8. Add debounce/refractory logic when needed.
9. Evaluate quantized/on-device model separately from training model.
10. Test CPU, memory, battery, and end-to-end trigger latency.

## Decision points
Prefer KWS over general ASR for small fixed vocabularies. Use two-stage confirmation when a single detector cannot meet both false-accept and latency targets.

## Common failure patterns
- Testing on balanced datasets only
- Missing phonetic hard negatives
- Threshold tuning on test data
- Ignoring background television or synthesized speech
- Failing to validate quantized inference

## Verification
Verify false accepts per hour, false reject rate, trigger latency, subgroup robustness, and device resource consumption.

## Expected output
A calibrated wake-word/KWS system with threshold policy, hard-negative suite, and device benchmarks.

## Stop conditions
Stop if required always-on resource use exceeds device constraints or false accepts remain unacceptable at the required miss rate.