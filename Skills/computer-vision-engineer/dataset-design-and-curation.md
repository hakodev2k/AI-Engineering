# Dataset Design and Curation

## Purpose
Build representative, traceable datasets that support reliable computer vision training and evaluation.

## When to use
Use when defining a dataset, expanding coverage, investigating model gaps, or preparing a new release.

## Inputs
Task definition, target populations/environments, raw media, labels, known failure cases, legal/privacy constraints.

## Preconditions
The prediction target and intended operating domain are explicit.

## Context to inspect
Sampling sources, class distribution, metadata, duplicates, leakage risks, annotation history, licensing, retention rules.

## Core knowledge
Dataset quality depends on representativeness, coverage, independence, provenance, and label reliability—not volume alone.

## Procedure
1. Define the target domain and rare but important conditions.
2. Create sampling strata and coverage goals.
3. Detect duplicates and near-duplicates.
4. Partition train/validation/test by leakage-safe units.
5. Track provenance and consent/licensing.
6. Measure class and condition distributions.
7. Add hard examples from observed failures.
8. Version dataset manifests and transformations.

## Decision points
Natural distribution vs balanced sampling; static benchmark vs continuously refreshed evaluation set.

## Common failure patterns
Scene leakage, duplicated frames across splits, over-represented easy cases, undocumented preprocessing, unlicensed data.

## Verification
Confirm split independence, coverage metrics, reproducible manifests, and representative spot checks.

## Expected output
Versioned dataset specification, manifests, split rationale, coverage report, and known gaps.

## Stop conditions
Stop when provenance is unclear, privacy requirements are unmet, or target-domain coverage cannot be established.