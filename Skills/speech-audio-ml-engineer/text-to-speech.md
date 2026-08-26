# Text-to-Speech Systems

## Purpose
Design and evaluate TTS systems that produce intelligible, natural, controllable speech within product constraints.

## When to use
Use for acoustic model, vocoder, voice adaptation, prosody, or synthesis-quality work.

## Inputs
Text/audio pairs, speaker data, pronunciation resources, target voices, latency and quality requirements.

## Context to inspect
Inspect text normalization, phonemization, alignments, speaker balance, acoustic model, vocoder, inference controls, and rights to voice data.

## Core knowledge
TTS quality depends on linguistic frontend, acoustic representation, duration/prosody modeling, vocoding, speaker conditioning, and data quality. Objective metrics alone do not establish perceptual quality.

## Procedure
1. Define voice, language, style, safety, and latency requirements.
2. Audit training data and voice rights.
3. Validate text normalization and pronunciation.
4. Establish intelligibility and naturalness baselines.
5. Isolate frontend, acoustic, and vocoder errors.
6. Improve the responsible stage.
7. Test long text, numbers, names, punctuation, and code-switching.
8. Run blinded listening evaluation.

## Decision points
Use phonemes when pronunciation control matters; graphemes may simplify multilingual pipelines. Choose autoregressive or non-autoregressive approaches based on quality/latency constraints.

## Common failure patterns
Skipped words, repetitions, unstable long-form synthesis, pronunciation errors, speaker leakage, vocoder artifacts, and unauthorized voice imitation.

## Verification
Measure intelligibility, latency, failure rate, and blinded human preference across representative cohorts.

## Expected output
A reproducible synthesis pipeline with perceptual and operational evidence.

## Stop conditions
Stop when voice rights are unclear, safety approval is required, or quality cannot be validated with representative listeners.