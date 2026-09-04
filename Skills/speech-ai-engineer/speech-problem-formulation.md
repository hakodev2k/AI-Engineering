# Speech AI Problem Formulation

## Purpose
Translate a speech-product requirement into a technically valid machine-learning problem with explicit targets, constraints, failure costs, and evaluation criteria.

## When to use
Use when starting or re-scoping ASR, TTS, diarization, speaker verification, VAD, keyword spotting, speech enhancement, or speech understanding work. Do not select architectures before the task, operating environment, and success metrics are understood.

## Inputs
- Product requirement and users
- Audio sources and channels
- Languages, accents, domains, and environments
- Latency, privacy, cost, and device constraints
- Available labeled and unlabeled data

## Context to inspect
Inspect sample rate, channel count, microphone conditions, expected SNR, streaming requirements, interaction pattern, domain vocabulary, target hardware, and downstream consumers.

## Core knowledge
Speech problems differ materially by target: transcription, detection, generation, identification, verification, segmentation, enhancement, or semantic interpretation. Metric selection must reflect real usage; WER alone is insufficient when latency, named entities, speaker attribution, or safety-critical commands matter.

## Procedure
1. Define the user-visible decision or output.
2. Identify acoustic, linguistic, device, and environmental conditions.
3. Define the unit of prediction and timing constraints.
4. Establish baseline systems and non-ML alternatives.
5. Map major error classes and their business cost.
6. Define offline metrics and production KPIs.
7. Specify data coverage requirements and known gaps.
8. Decide whether processing is batch, streaming, on-device, edge, or cloud.
9. Document privacy, retention, and consent constraints.
10. Write acceptance criteria before model selection.

## Decision points
Choose task formulations based on actual interaction needs; for example, keyword spotting may outperform full ASR for fixed commands, and speaker verification differs fundamentally from speaker identification.

## Common failure patterns
- Optimizing a benchmark metric disconnected from user experience
- Ignoring accents, noise, reverberation, or channel mismatch
- Assuming cloud inference when data cannot leave device
- Treating latency as an afterthought

## Verification
The formulation is verified when stakeholders agree on task boundaries, representative conditions, error costs, target metrics, deployment constraints, and baseline comparisons.

## Expected output
A concise speech-AI problem specification with task definition, constraints, data assumptions, metrics, baselines, and risks.

## Stop conditions
Stop and escalate when required audio cannot legally be used, target conditions are undefined, or success cannot be measured objectively.