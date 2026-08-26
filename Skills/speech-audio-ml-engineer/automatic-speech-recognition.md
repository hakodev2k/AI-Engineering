# Automatic Speech Recognition

## Purpose
Design and improve ASR systems that convert speech into accurate, usable text under real deployment conditions.

## When to use
Use for ASR architecture, training, decoding, adaptation, or error reduction.

## Inputs
Audio/text pairs, language requirements, vocabulary, latency target, deployment environment, baseline WER/CER.

## Context to inspect
Inspect text normalization, tokenizer, acoustic conditions, language mix, model family, decoding configuration, and cohort metrics.

## Core knowledge
Understand CTC, transducer and encoder-decoder approaches; tokenization; beam search; language-model fusion; streaming constraints; WER/CER and normalization sensitivity.

## Procedure
1. Define transcription conventions and evaluation normalization.
2. Establish stratified baseline metrics.
3. Inspect substitution, deletion, and insertion errors.
4. Separate acoustic, lexical, language, and segmentation causes.
5. Improve data, tokenizer, model, or decoder based on evidence.
6. Tune decoding on development data only.
7. Evaluate latency and memory alongside accuracy.
8. Test noisy, accented, code-switched, and long-form speech where relevant.

## Decision points
Choose streaming models for bounded interactive latency; offline models when global context materially improves quality. Use external LM fusion only when gains justify operational complexity.

## Common failure patterns
Test-set tuning, inconsistent normalization, speaker leakage, rare-word collapse, hallucinated text in silence, and accuracy improvements that violate latency budgets.

## Verification
Report frozen-set WER/CER by cohort, real-time factor, tail latency, memory, and representative qualitative errors.

## Expected output
An ASR system or change with reproducible accuracy and serving evidence.

## Stop conditions
Escalate when required language coverage or labeled data is insufficient for the target accuracy.