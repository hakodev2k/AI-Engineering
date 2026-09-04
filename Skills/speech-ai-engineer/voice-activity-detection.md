# Voice Activity Detection

## Purpose
Detect speech boundaries reliably enough to drive streaming, segmentation, diarization, recording control, and downstream inference.

## When to use
Use when a system must distinguish speech from silence/noise, segment continuous audio, reduce compute, or trigger downstream speech processing.

## Inputs
- Representative audio
- Frame/window requirements
- Downstream latency tolerance
- Speech/no-speech labels or proxy annotations

## Context to inspect
Inspect noise types, reverberation, music, breathing, keyboard sounds, far-field speech, overlapping speech, and minimum useful utterance duration.

## Core knowledge
VAD is a temporal decision problem. Frame accuracy alone is insufficient; hangover, onset delay, offset delay, false triggers, and clipped speech boundaries often dominate product quality.

## Procedure
1. Define what counts as speech for the product.
2. Establish frame and event-level metrics.
3. Evaluate baseline energy and model-based detectors.
4. Tune onset, offset, smoothing, and hangover parameters.
5. Test low-SNR, far-field, music, and non-speech vocal sounds.
6. Measure how VAD errors affect downstream ASR or diarization.
7. Add adaptive thresholds only if they are stable across conditions.
8. Verify real-time CPU and latency budgets.
9. Build regression clips for boundary failures.

## Decision points
Prefer simple energy-based methods for constrained clean environments; use learned VAD for diverse acoustics. Bias toward recall when clipped speech is expensive, and toward precision when false activation is expensive.

## Common failure patterns
- Tuning only frame F1
- Cutting initial/final phonemes
- Treating music as speech
- Excessive hangover increasing latency
- Failing to test unseen microphones

## Verification
Verify event precision/recall, onset/offset timing, downstream ASR impact, false activation rate, and resource usage.

## Expected output
A tuned VAD configuration with temporal metrics, failure-mode evaluation, and integration guidance.

## Stop conditions
Stop if product semantics for speech are undefined or downstream systems require boundary accuracy the available detector cannot provide.