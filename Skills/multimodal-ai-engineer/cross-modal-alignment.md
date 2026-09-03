# Cross-Modal Alignment

## Purpose
Align representations and supervision across modalities so semantically related text, images, audio, video, and documents are associated correctly during training and inference.

## When to use
Use when building contrastive models, multimodal retrieval, captioning, grounding, or any pipeline where one modality supervises or queries another.

## Inputs
Paired or weakly paired data, timestamps, identifiers, labels, embedding models, alignment metrics.

## Preconditions
Have a defensible definition of what constitutes a positive and negative cross-modal pair.

## Context to inspect
Inspect data pairing logic, temporal offsets, duplicate content, noisy captions, sampling strategy, hard-negative mining, and leakage across splits.

## Core knowledge
Alignment quality depends on pairing semantics, temporal granularity, negative sampling, and representation normalization. False positives and false negatives can dominate training signal. Weak supervision must be treated as probabilistic evidence, not ground truth.

## Procedure
1. Define alignment semantics for each modality pair.
2. Audit pairing keys and temporal windows.
3. Quantify missing, duplicated, and contradictory pairs.
4. Establish positive, random-negative, and hard-negative sampling.
5. Prevent near-duplicate leakage across train/eval splits.
6. Normalize representation scales when required by the objective.
7. Train or calibrate alignment objectives.
8. Evaluate retrieval in both directions.
9. Slice metrics by modality quality and domain.
10. Inspect nearest-neighbor failures manually.
11. Tune thresholds on held-out data.
12. Document ambiguity classes that require downstream handling.

## Decision points
Use exact pairing when reliable identifiers exist; use temporal or semantic windows when synchronization is approximate. Use hard negatives only after confirming they are truly negative.

## Common failure patterns
Timestamp drift; duplicate positives counted as negatives; caption leakage; optimizing only one retrieval direction; embedding collapse; overfitting benchmark-specific pair construction.

## Verification
Measure Recall@K or task-appropriate retrieval metrics bidirectionally, inspect failure slices, and validate pair correctness on a sampled audit set.

## Expected output
An alignment pipeline with documented pair semantics, sampling rules, calibrated thresholds, and error analysis.

## Stop conditions
Stop when pairing quality is too poor to support the objective or evaluation cannot distinguish true semantic mismatch from annotation noise.