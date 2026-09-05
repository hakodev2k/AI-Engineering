# Multimodal Data Generation

## Purpose
Generate aligned synthetic datasets spanning text, image, audio, video, sensor, or structured modalities while maintaining cross-modal consistency and task relevance.

## When to use
Use for vision-language models, document understanding, conversational assistants with media, embodied AI, sensor fusion, or multimodal evaluation where aligned real data is scarce.

## Inputs
Modalities, alignment schema, target task, reference examples, generation models/simulators, synchronization rules, labels, acceptance metrics.

## Preconditions
Each modality has clear ownership, privacy constraints, and validation methods. Cross-modal alignment requirements are explicit.

## Context to inspect
Timing, semantic relationships, captions, transcripts, metadata, sampling rates, spatial relationships, label dependencies, known modality-specific failure modes.

## Core knowledge
Multimodal usefulness depends on alignment quality, not independent realism. A realistic image paired with an inaccurate caption creates harmful supervision. Temporal and semantic synchronization errors can dominate downstream model behavior.

## Procedure
1. Define the unit of alignment and task objective.
2. Specify invariants across modalities.
3. Choose a generation order: one modality conditions others, joint generation, or simulator-derived outputs.
4. Record generation lineage for every component.
5. Validate per-modality format and quality.
6. Validate semantic and temporal consistency across modalities.
7. Detect contradictions, missing modality content, and shortcut cues.
8. Compare coverage with representative real multimodal data.
9. Evaluate downstream performance on real aligned holdouts.
10. Analyze failures by modality and interaction effect.

## Decision points
Prefer simulator-derived synchronization for physical systems. Prefer conditional generation when one modality is authoritative. Use human review for alignment dimensions automatic metrics cannot reliably judge.

## Common failure patterns
Validating each modality independently, mismatched captions, synthetic timing artifacts, inconsistent entity identity, and hidden generation cues that simplify the task unrealistically.

## Verification
Measure per-modality quality, cross-modal consistency, task utility, and robustness on independent real-world data.

## Expected output
A versioned multimodal corpus with alignment metadata, validation metrics, and known limitations.

## Stop conditions
Stop when cross-modal consistency cannot be validated or one modality introduces unresolved safety, privacy, or licensing risk.