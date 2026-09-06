# Multilingual Speech and Voice Localization

## Purpose
Engineer locale-correct speech recognition and synthesis behavior for AI experiences, including accents, pronunciation, code-switching, turn timing, and voice expectations.

## When to use
Use when an AI product includes ASR, TTS, voice agents, spoken search, dictation, or audio responses across multiple locales.

## Inputs
Target locales, audio use cases, ASR/TTS providers, domain vocabulary, latency budget, supported devices, safety requirements, and representative audio.

## Preconditions
Consent, recording, and data-processing requirements are defined.

## Context to inspect
Inspect audio preprocessing, language detection, endpointing, ASR hints, pronunciation dictionaries, TTS voices, transcript normalization, downstream prompts, and telemetry.

## Core knowledge
Speech quality depends on accent, dialect, acoustic conditions, domain vocabulary, code-switching, prosody, and language identification. Transcript accuracy alone does not guarantee conversational quality; latency and interruption behavior matter.

## Procedure
1. Define locale and accent coverage from real users.
2. Build representative audio sets across environments and speakers.
3. Evaluate ASR word/semantic error with emphasis on critical entities.
4. Test language detection and code-switching.
5. Add domain vocabulary or contextual biasing where supported.
6. Evaluate TTS pronunciation, intelligibility, prosody, and locale fit.
7. Test turn-taking, interruption, latency, and error recovery.
8. Add regression cases for names, numbers, addresses, and high-impact terminology.

## Decision points
Use locale-specific models when they materially improve critical accuracy; use multilingual models when routing complexity outweighs gains. Prefer human confirmation for high-impact misrecognition risk.

## Common failure patterns
Testing studio audio only, measuring WER without semantic impact, ignoring accent distribution, forcing a single voice style globally, and losing locale after ASR.

## Verification
Run end-to-end spoken tasks with native speakers and representative audio, verifying transcript meaning, response correctness, pronunciation, latency, and recovery.

## Expected output
A locale-specific speech quality report with provider configuration, regressions, and acceptance thresholds.

## Stop conditions
Stop when consent or regional audio-processing requirements are unresolved or critical speech accuracy remains below safe operating thresholds.