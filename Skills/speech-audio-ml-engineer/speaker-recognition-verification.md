# Speaker Recognition and Verification

## Purpose
Build and assess systems that represent, identify, or verify speakers while controlling security and fairness risks.

## When to use
Use for speaker embeddings, verification, identification, enrollment, or threshold calibration.

## Inputs
Speaker-labeled audio, enrollment protocol, threat model, operating costs, demographic/environment cohorts.

## Context to inspect
Inspect speaker/session overlap, utterance duration, channels, spoof exposure, embedding model, scoring, and thresholds.

## Core knowledge
Verification is an open-set decision problem. EER is descriptive; production thresholds should reflect false-accept/false-reject costs and operating priors.

## Procedure
1. Define enrollment and verification scenarios.
2. Create speaker-disjoint, session-aware evaluation.
3. Train or select embedding model.
4. Normalize and score embeddings consistently.
5. Plot DET/ROC and calibrate thresholds.
6. Evaluate short, noisy, cross-device, and cross-session speech.
7. Measure cohort disparities.
8. Add spoof defenses when authentication is involved.

## Decision points
Choose cosine/PLDA/neural scoring based on data and calibration needs. Do not use voice biometrics as sole authentication without threat analysis.

## Common failure patterns
Speaker leakage, threshold selection on test data, channel shortcuts, poor calibration, and ignoring replay or synthetic speech.

## Verification
Report FAR/FRR at intended operating points, calibration, cohort results, and spoof tests.

## Expected output
A calibrated speaker system with explicit operating and security assumptions.

## Stop conditions
Escalate when biometric/privacy approval is missing or threat requirements exceed available anti-spoofing evidence.