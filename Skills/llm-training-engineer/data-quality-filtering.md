# Data Quality Filtering

## Purpose
Build evidence-driven filters that improve training signal while avoiding destructive removal of valuable diversity.

## When to use
Use when constructing or revising large text/code corpora, especially before expensive training.

## Inputs
Raw datasets, metadata, language/domain labels, quality classifiers, heuristic signals, safety requirements, retained-sample audits.

## Context to inspect
Source distributions, encoding issues, boilerplate, spam, synthetic content, PII policy, language identification, code validity, and previous filter thresholds.

## Core knowledge
Filtering changes the learned distribution. Aggressive heuristics can erase minority languages, informal styles, difficult examples, or domain-specific syntax. Classifier-based filters inherit classifier bias and calibration errors.

## Procedure
1. Define defects each filter is intended to remove.
2. Measure defect prevalence on stratified samples.
3. Implement deterministic, versioned filters where possible.
4. Calibrate probabilistic thresholds on labeled samples.
5. Audit retained and rejected examples across domains and languages.
6. Quantify token removal and distribution shift per stage.
7. Test filter ordering because stages can interact.
8. Run downstream ablations for high-impact filters.
9. Preserve lineage sufficient to reproduce the final corpus.

## Decision points
Use hard rejection for clear corruption or policy violations; use weighting or soft thresholds when quality is continuous. Prefer interpretable heuristics for obvious defects and classifiers for patterns heuristics cannot capture reliably.

## Common failure patterns
Optimizing classifier score instead of model outcome; no rejected-sample audit; language-biased thresholds; removing useful repetition such as code idioms; silently changing filters between runs.

## Verification
Re-run the pipeline deterministically, inspect stratified acceptance/rejection samples, compare distribution statistics, and validate model-level effects through controlled experiments.

## Expected output
A reproducible filtering pipeline with thresholds, audits, removal statistics, and measured downstream impact.

## Stop conditions
Stop when filters cannot be reproduced, materially bias critical slices without justification, or provenance/policy requirements cannot be satisfied.