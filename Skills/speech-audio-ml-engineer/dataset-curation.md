# Speech and Audio Dataset Curation

## Purpose
Build representative, traceable datasets that support reliable speech/audio ML development and evaluation.

## When to use
Use when creating, extending, filtering, or versioning training and evaluation corpora.

## Inputs
Raw recordings, annotations, consent/licensing information, task definition, population requirements, and quality targets.

## Context to inspect
Inspect provenance, rights, speaker overlap, language and accent coverage, recording environments, devices, durations, label taxonomy, and historical splits.

## Core knowledge
Dataset quality depends on coverage, provenance, label consistency, leakage control, and alignment with deployment conditions. More hours do not compensate for systematic bias or contamination.

## Procedure
1. Translate product conditions into dataset strata.
2. Validate provenance and permitted uses.
3. Profile recordings and labels.
4. Detect duplicates and near-duplicates.
5. Establish speaker/session/source-aware splits.
6. Define acceptance and exclusion rules.
7. Balance or weight underrepresented conditions intentionally.
8. Version manifests and transformation logic.
9. Preserve a frozen evaluation set.
10. Document known gaps.

## Decision points
Choose filtering versus weighting based on whether data is invalid or merely imbalanced. Prefer split boundaries that model real generalization requirements.

## Common failure patterns
Speaker leakage, duplicated clips across splits, benchmark contamination, hidden licensing restrictions, noisy labels, and over-clean datasets unlike production.

## Verification
Run overlap checks, stratified statistics, spot audits, and baseline evaluations by cohort.

## Expected output
Versioned manifests, documented provenance, defensible splits, and measurable coverage.

## Stop conditions
Stop when consent or rights are unresolved, identity leakage cannot be controlled, or evaluation contamination is detected.