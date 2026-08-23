# Text Data Quality and Corpus Design

## Purpose
Build and assess text corpora that are representative, legally usable, traceable, and suitable for reliable NLP training and evaluation.

## When to use
Use for dataset creation, model retraining, domain adaptation, benchmark construction, or data-quality investigations.

## Inputs
Raw text sources, source licenses, sampling rules, product traffic distributions, labels, language metadata, privacy requirements.

## Preconditions
Data provenance and intended use can be determined.

## Context to inspect
Source mix, duplication, boilerplate, encoding, language distribution, temporal coverage, sensitive data, label balance, train/evaluation overlap.

## Core knowledge
Text datasets encode sampling bias, temporal drift, duplication, annotation artifacts, privacy risks, and domain mismatch. Corpus quality is often more important than incremental model complexity.

## Procedure
1. Define target population and important slices.
2. Inventory sources and provenance.
3. Validate licenses, consent, retention, and access rules.
4. Normalize encodings and document formats without erasing meaningful structure.
5. Detect duplicates, near-duplicates, templates, spam, and corrupted records.
6. Measure language, domain, length, label, and time distributions.
7. Inspect sensitive and regulated content.
8. Prevent leakage across train, validation, and test sets.
9. Create representative sampling and holdout policies.
10. Version the corpus and record transformations.
11. Run qualitative spot checks on every critical slice.

## Decision points
Deduplicate aggressively for memorization-prone tasks, but preserve repeated real-world patterns when frequency is operationally meaningful. Stratify when rare but costly cases would otherwise disappear.

## Common failure patterns
Random splits with duplicated documents, hidden test contamination, silent Unicode corruption, missing source lineage, over-cleaning, and training on distributions unlike production.

## Verification
Distribution reports, leakage checks, provenance records, privacy review, and reproducible dataset build all pass.

## Expected output
Versioned corpus, quality report, lineage, split policy, transformation manifest, and known limitations.

## Stop conditions
Stop when provenance is unknown, prohibited data is present, leakage cannot be controlled, or representative sampling is impossible.