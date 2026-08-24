# Evaluation Dataset Curation

## Purpose
Build and maintain evaluation datasets that are representative, traceable, privacy-aware, and stable enough for longitudinal comparison.

## When to use
Use when collecting examples for offline evaluation, refreshing stale suites, adding new domains or failure modes, or preparing human-labeled evaluation corpora.

## Inputs
- Raw examples and production traces
- Data usage constraints
- Sampling objectives
- Label schema
- Existing evaluation datasets

## Preconditions
Data access, retention, and privacy requirements must be known before production-derived data is copied into an evaluation corpus.

## Context to inspect
Inspect source distributions, duplicates, sensitive data, temporal drift, language/domain balance, labels, provenance, and historical usage of candidate examples.

## Core knowledge
An evaluation dataset is a measurement instrument. Selection bias, leakage, duplicate examples, label noise, and hidden temporal drift can invalidate comparisons. Dataset versioning must separate data changes from model changes.

## Procedure
1. Define the target population the dataset should represent.
2. Establish inclusion, exclusion, and privacy rules.
3. Sample across normal, edge, and high-risk behavior rather than only frequent traffic.
4. Deduplicate exact and semantic near-duplicates where duplication would distort scores.
5. Redact or tokenize sensitive values without destroying the evaluated behavior.
6. Assign provenance, timestamp, domain, difficulty, and failure-mode metadata.
7. Label using deterministic rules or reviewed annotation workflows.
8. Audit disagreement and ambiguous cases before final inclusion.
9. Split development, validation, and hidden holdout sets when optimization pressure exists.
10. Version the dataset immutably and record all changes.

## Decision points
Stratify sampling when rare failures matter more than their natural frequency. Preserve natural prevalence when estimating production rates. Use hidden holdouts when developers repeatedly inspect item-level failures.

## Common failure patterns
- Sampling only user complaints
- Keeping private or regulated data unnecessarily
- Mutating a benchmark in place
- Mixing test and tuning data
- Ignoring stale examples after product behavior changes

## Verification
Verify counts and distributions by slice, duplicate rate, label agreement, privacy checks, provenance completeness, and reproducible dataset hashes.

## Expected output
A versioned evaluation corpus with documented sampling logic, metadata, privacy controls, and quality checks.

## Stop conditions
Stop when legal or privacy constraints are unresolved, source provenance is unknown, or the required population cannot be represented with defensible sampling.