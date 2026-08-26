# Voice Activity Detection

## Purpose
Detect speech boundaries robustly to reduce compute, improve segmentation, and prevent downstream errors.

## When to use
Use in streaming ASR, diarization, recording pipelines, endpointing, or audio analytics.

## Inputs
Audio, speech/non-speech labels, noise conditions, latency and false-trigger costs.

## Context to inspect
Inspect frame sizes, thresholds, hangover logic, noise profiles, music, overlapping events, and downstream segmentation assumptions.

## Core knowledge
VAD trades missed speech against false alarms and endpoint latency. Calibration must reflect the deployment environment rather than a single aggregate F1 score.

## Procedure
1. Define speech and non-speech operationally.
2. Build representative evaluation strata.
3. Establish frame-level and segment-level baselines.
4. Tune thresholds and smoothing on development data.
5. Test onset clipping and trailing latency.
6. Evaluate noise, music, far-field, and low-volume speech.
7. Measure downstream ASR/diarization impact.

## Decision points
Prefer conservative thresholds when clipped speech is costly; stricter thresholds when false activations dominate cost. Neural VAD is justified when simple energy rules fail materially.

## Common failure patterns
Clipped initial phonemes, endless open segments, music false positives, threshold overfitting, and offline logic unsuitable for streaming.

## Verification
Measure miss/false-alarm rates, endpoint latency, segment quality, and downstream task metrics.

## Expected output
A calibrated VAD/endpointing configuration with measured trade-offs.

## Stop conditions
Escalate when deployment noise is not represented or latency requirements cannot be met without unacceptable speech loss.