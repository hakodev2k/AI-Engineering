# Speaker Verification

## Purpose
Build systems that determine whether a speech sample matches an enrolled speaker while managing spoofing, threshold, and subgroup risks.

## When to use
Use for authentication, account recovery, personalization, or speaker-aware workflows requiring one-to-one identity verification.

## Inputs
- Enrollment utterances
- Verification utterances
- Speaker labels
- Threat model
- Operating false-accept/false-reject targets

## Context to inspect
Inspect microphone variability, channel mismatch, utterance duration, replay risk, synthetic speech risk, demographic coverage, enrollment quality, and expected background noise.

## Core knowledge
Speaker verification typically uses embeddings and similarity scoring with an operating threshold. EER is descriptive, not an operating policy. Security-sensitive deployments need spoof detection, replay defenses, and explicit false-accept constraints.

## Procedure
1. Define identity, enrollment, and authentication flows.
2. Establish genuine and impostor evaluation trials.
3. Train or select robust speaker embeddings.
4. Normalize embeddings/scores if justified.
5. Measure DET/ROC behavior and subgroup performance.
6. Select thresholds from business/security costs, not EER alone.
7. Test short utterances, noise, codec, and device mismatch.
8. Evaluate replay, voice conversion, and synthetic-speech attacks.
9. Add anti-spoofing or challenge-response controls where necessary.
10. Define enrollment refresh and revocation procedures.
11. Validate production latency and fallback behavior.

## Decision points
Use stricter thresholds for high-value actions. Require multi-factor authentication when voice alone cannot achieve acceptable attack resistance. Re-enroll when channel or speaker characteristics materially change.

## Common failure patterns
- Deploying the EER threshold directly
- Ignoring spoofing and replay
- Evaluating only clean same-device speech
- Storing raw voice data without necessity
- Treating similarity as identity certainty

## Verification
Verify FAR/FRR at the chosen threshold, spoof attack performance, subgroup differences, enrollment stability, and fallback behavior under low-quality audio.

## Expected output
A verified speaker-authentication configuration with threshold rationale, security controls, evaluation evidence, and operational policy.

## Stop conditions
Stop if attack resistance is inadequate for the action risk, consent/biometric handling is unresolved, or subgroup error disparities cannot be assessed.