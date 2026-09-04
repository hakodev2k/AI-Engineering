# ASR Decoding and Language Biasing

## Purpose
Improve transcription accuracy at inference time through principled decoding, language-model integration, contextual biasing, and confidence-aware tuning.

## When to use
Use when acoustic/model quality is reasonable but errors cluster around vocabulary, domains, names, or search-space decisions.

## Inputs
- ASR logits or hypotheses
- Decoder configuration
- Domain text or language model
- Dynamic phrase lists
- Evaluation utterances

## Context to inspect
Inspect tokenizer, beam search parameters, blank behavior, LM weight, length penalties, hotword configuration, timestamps, and whether streaming constraints limit lookahead.

## Core knowledge
Decoding trades accuracy, latency, memory, and search errors. External language models or contextual biasing can reduce lexical errors but can also hallucinate expected phrases or suppress acoustically valid alternatives.

## Procedure
1. Establish greedy or default decoding baseline.
2. Classify errors attributable to search versus model emissions.
3. Sweep beam size and pruning thresholds under latency limits.
4. Tune LM and insertion/length weights on a held-out development set.
5. Add contextual phrases with controlled boost strengths.
6. Measure false biasing on acoustically similar non-target phrases.
7. Evaluate rare names and domain terms separately.
8. Verify partial-hypothesis stability for streaming systems.
9. Calibrate confidence if downstream automation consumes transcripts.
10. Freeze decoding parameters and run final test-set evaluation once.

## Decision points
Use larger beams only when gains justify latency. Prefer dynamic contextual biasing for changing entity sets. Avoid strong global boosts when acoustics are weak or phrase lists are large.

## Common failure patterns
- Tuning on the test set
- Increasing beam size without latency measurement
- Overboosting hotwords and creating hallucinations
- Mixing transcript normalization with decoding changes
- Assuming confidence scores are calibrated probabilities

## Verification
Compare WER, entity recall/precision, false-bias rate, real-time factor, tail latency, and confidence calibration against the baseline.

## Expected output
A documented decoder configuration, tuning evidence, contextual-bias strategy, and regression results.

## Stop conditions
Stop if decoding cannot recover errors visible in model emissions, latency limits are violated, or biasing materially increases false positives.