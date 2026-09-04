# Automatic Speech Recognition

## Purpose
Design, train, adapt, and validate ASR systems for production transcription under realistic acoustic and linguistic conditions.

## When to use
Use for general transcription, command recognition requiring open vocabulary, call transcription, captioning, or speech-to-text pipelines.

## Inputs
- Labeled speech corpus
- Domain text and vocabulary
- Deployment latency target
- Language/accent scope
- Baseline model and decoder

## Context to inspect
Inspect transcription conventions, domain shift, utterance lengths, streaming requirements, punctuation/casing needs, code-switching, named entities, and hardware constraints.

## Core knowledge
ASR quality depends on acoustic representation, sequence modeling, tokenization, decoding, language biasing, and transcript normalization. WER must be supplemented with entity, latency, and subgroup metrics where relevant.

## Procedure
1. Define transcript normalization and scoring policy.
2. Establish a strong pretrained or existing baseline.
3. Evaluate by domain, accent, noise, device, and utterance length.
4. Inspect insertion, deletion, substitution, and entity errors.
5. Decide whether adaptation should target acoustic, lexical, or language components.
6. Fine-tune with leakage-safe data splits.
7. Tune decoding independently from model training.
8. Add domain vocabulary or contextual biasing when justified.
9. Evaluate streaming partial and final hypotheses if applicable.
10. Validate latency, memory, and cost on target hardware.
11. Run regression suites before deployment.

## Decision points
Prefer adaptation over full training when a capable pretrained model exists. Use contextual biasing for dynamic entities rather than globally distorting language probabilities. Choose streaming architectures only when interaction latency requires them.

## Common failure patterns
- Reporting aggregate WER only
- Training on inconsistent transcript conventions
- Overfitting domain phrases while degrading general speech
- Ignoring deletion errors in noisy conditions
- Evaluating with leaked speakers or sessions

## Verification
Verify normalized WER/CER, critical-entity accuracy, subgroup performance, real-time factor, end-to-end latency, and representative production replay tests.

## Expected output
A validated ASR model/configuration with evaluation report, decoding settings, deployment constraints, and known limitations.

## Stop conditions
Stop if target-language data is inadequate, evaluation leakage is suspected, or production latency cannot meet requirements without architectural change.