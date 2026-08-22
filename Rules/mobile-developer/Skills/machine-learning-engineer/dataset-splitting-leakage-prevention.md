# Dataset Splitting and Leakage Prevention

## Purpose
Produce evaluation partitions that estimate real deployment performance rather than memorization or future knowledge.

## When to use
For every supervised ML experiment and whenever data generation changes.

## Inputs
Examples, entity IDs, timestamps, labels, grouping relationships, deployment scenario.

## Context to inspect
Temporal ordering, repeated entities, near duplicates, shared sources, target-derived fields, preprocessing boundaries.

## Core knowledge
Random splitting is invalid when observations are temporally or relationally dependent. Leakage can enter through labels, preprocessing, duplicates, aggregates, or selection rules.

## Procedure
1. Model how future inference examples will arrive.
2. Identify dependency groups and time boundaries.
3. Choose random, grouped, stratified, temporal, or hybrid splitting accordingly.
4. Deduplicate before partitioning when appropriate.
5. Fit all learned preprocessing on training data only.
6. Reserve an untouched final test set.
7. Audit suspiciously predictive features and cross-partition similarity.
8. Version split logic and seeds.

## Decision points
Use temporal splits for future prediction; group splits when the same entity must not cross partitions; stratify only when it does not violate causal structure.

## Common failure patterns
Randomly splitting repeated users, tuning on the test set, global normalization, post-outcome features, and duplicate records across splits.

## Verification
Recreate partitions deterministically, prove group/time constraints, and confirm preprocessing statistics originate only from training data.

## Expected output
Versioned split definitions with leakage audit evidence.

## Stop conditions
Stop when deployment chronology or entity relationships cannot be established reliably.