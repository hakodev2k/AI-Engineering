# Training Data and Memorization Probing

## Purpose
Assess whether a model reveals memorized sensitive or proprietary training examples under adversarial prompting.

## When to use
Use for custom-trained or fine-tuned models when training data provenance or confidentiality creates material risk.

## Inputs
Authorized model endpoint, training-data governance records, synthetic canaries where available, fine-tuning process, sampling controls, and privacy requirements.

## Context to inspect
Understand training/fine-tuning sources, deduplication, data filtering, access controls, retention, and whether the test can use known synthetic sequences.

## Core knowledge
Memorization differs from ordinary knowledge and retrieval. Repeated or unique sequences, overfitting, and small fine-tuning datasets can increase exposure. Testing must avoid collecting unrelated personal data.

## Procedure
1. Define what constitutes unacceptable memorization.
2. Prefer synthetic canaries and authorized known examples.
3. Establish benign completion baselines.
4. Probe prefixes, transformations, contextual cues, and repeated sampling.
5. Measure exact and semantic reproduction.
6. Separate retrieval leakage from model memorization.
7. Analyze correlation with data frequency and fine-tuning configuration.
8. Recommend deduplication, filtering, training, or serving controls.
9. Retest on a held-out probe set.

## Decision points
Use stronger privacy-preserving training or exclude sensitive data when memorization risk cannot be mitigated reliably at serving time.

## Common failure patterns
Searching for unknown real personal data; claiming memorization from generic facts; ignoring sampling variance; mixing RAG results with model-memory findings.

## Verification
A finding requires repeatable evidence attributable to model parameters or training behavior, with controls ruling out retrieval and prompt-provided information.

## Expected output
A scoped memorization assessment with evidence, confidence, likely source, and mitigation options.

## Stop conditions
Stop when probes begin surfacing unrelated real personal data or when training-data authorization is insufficient.