# Deduplication and Contamination Control

## Purpose
Prevent synthetic datasets from containing exact or near duplicates, leaking source examples, or contaminating evaluation sets and benchmarks.

## When to use
Use before training, evaluation, release, or sharing of any generated corpus, especially when generators were conditioned on source examples or benchmark material.

## Inputs
Synthetic dataset, source datasets, training corpora, evaluation sets, benchmark sets, similarity models, contamination thresholds.

## Preconditions
Relevant source and evaluation datasets can be compared under approved access controls.

## Context to inspect
Exact hashes, normalized text/image forms, embedding similarity, entity overlap, prompt examples, retrieval context, benchmark provenance, generator training sources when known.

## Core knowledge
Synthetic generation can reproduce memorized or heavily paraphrased source items. Near-duplicate contamination creates inflated evaluation scores and weak generalization even when no byte-identical copy exists.

## Procedure
1. Normalize records for modality-appropriate comparison.
2. Remove exact duplicates within the synthetic corpus.
3. Detect near duplicates using lexical, perceptual, structural, or embedding similarity.
4. Compare synthetic records against protected evaluation and benchmark sets.
5. Compare against source examples used for conditioning.
6. Establish thresholds by modality and risk rather than one universal cutoff.
7. Manually inspect borderline high-similarity cases.
8. Remove or quarantine contaminated samples.
9. Track deduplication decisions and corpus versions.
10. Re-run contamination checks after regeneration or dataset merges.

## Decision points
Use conservative thresholds for evaluation data and privacy-sensitive sources. Allow legitimate structural similarity when the task requires standardized formats, but ensure semantic content is independent.

## Common failure patterns
Hash-only deduplication, checking training duplicates but not benchmark leakage, ignoring paraphrases, and deleting records without updating provenance.

## Verification
Published data passes exact and near-duplicate checks against itself, source corpora, and protected evaluation material under documented thresholds.

## Expected output
A cleaned corpus, contamination report, removed-sample manifest, and reproducible similarity configuration.

## Stop conditions
Stop when benchmark provenance is unknown, contamination cannot be confidently separated from legitimate overlap, or source-access restrictions prevent required validation.