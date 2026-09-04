# Speech Evaluation and Error Analysis

## Purpose
Build evaluation systems that reveal whether speech models work for real users, where they fail, and whether changes are true improvements rather than benchmark noise.

## When to use
Use before model selection, during experimentation, at release gates, after incidents, and when production KPIs diverge from offline metrics.

## Inputs
- Held-out audio and annotations
- Model outputs
- Product KPIs
- Metadata for language, accent, device, noise, speaker, and domain
- Baseline results

## Context to inspect
Inspect data provenance, split integrity, transcript normalization, confidence intervals, subgroup sizes, annotation quality, and whether metrics reflect actual operating costs.

## Core knowledge
Speech metrics are task-specific: WER/CER for ASR, DER/JER for diarization, FAR/FRR/EER for verification, event errors for VAD/KWS, and human/perceptual measures for TTS. Aggregate metrics can conceal severe slice regressions.

## Procedure
1. Define primary, guardrail, latency, and subgroup metrics.
2. Freeze normalization/scoring rules before comparing models.
3. Verify test-set independence and annotation quality.
4. Compute aggregate results with uncertainty where practical.
5. Slice by language, accent, device, SNR, utterance length, speaker traits, and domain where permitted.
6. Classify representative errors manually.
7. Quantify critical entities or commands separately from generic words.
8. Compare against baselines and statistical variability.
9. Build a persistent regression set from real failure modes.
10. Correlate offline metrics with production outcomes.
11. Document regressions explicitly rather than averaging them away.

## Decision points
Use task-specific metrics instead of forcing WER everywhere. Require human evaluation for subjective synthesis quality. Treat small subgroup results as uncertain rather than definitive.

## Common failure patterns
- Test-set tuning
- Aggregate-only reporting
- Changing normalization between runs
- Ignoring annotation disagreements
- Claiming small gains without variance estimates

## Verification
Evaluation is verified when scoring is reproducible, leakage checks pass, slices cover important conditions, and conclusions remain supported after error inspection.

## Expected output
A reproducible evaluation report with baseline comparison, slices, failure taxonomy, regressions, and release recommendation.

## Stop conditions
Stop if the evaluation set is contaminated, annotations are unreliable, or the metric cannot represent the product decision being made.