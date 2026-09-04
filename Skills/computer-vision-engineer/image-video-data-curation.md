# Image and Video Data Curation

## Purpose
Build representative, legally usable, high-signal visual datasets that support robust training and defensible evaluation.

## When to use
Use for new datasets, dataset refreshes, domain expansion, drift response, or unexplained model failure.

## Inputs
Raw image/video sources, metadata, label definitions, privacy/licensing constraints, production distribution evidence, and current model errors.

## Preconditions
Data use rights and retention rules are known or can be reviewed by the appropriate owner.

## Context to inspect
Inspect capture devices, sampling logic, duplicate rates, class prevalence, environments, time periods, demographics where relevant, compression, resolution, corruption, and leakage across entities or sequences.

## Core knowledge
Visual datasets are vulnerable to near-duplicates, temporal leakage, hidden capture artifacts, selection bias, long-tail scarcity, and spurious background correlations. Split design must reflect the intended generalization boundary.

## Procedure
1. Define the target production population and important slices.
2. Inventory sources and provenance.
3. Validate permissions and sensitive-content handling.
4. Measure dimensions, codecs, corruption, duplicates, and metadata completeness.
5. Profile class and condition coverage.
6. Cluster or hash for exact and near-duplicate detection.
7. Sample hard, rare, and operationally important conditions intentionally.
8. Design train/validation/test splits by entity, location, device, or time as appropriate.
9. Prevent frames from the same sequence leaking across splits.
10. Version the dataset and curation rules.
11. Produce slice-level coverage reports.
12. Reassess coverage against production telemetry after deployment.

## Decision points
Use random splits only when observations are genuinely independent. Prefer group/time/location splits when future deployment requires generalization across those boundaries. Oversample rare cases for training while preserving realistic evaluation prevalence.

## Common failure patterns
Duplicate leakage, test-set tuning, synthetic prevalence replacing real prevalence, missing night/weather/device slices, and silently dropping corrupted files that are common in production.

## Verification
Verify provenance, deduplication, split isolation, label distribution, slice coverage, and reproducible dataset version hashes.

## Expected output
A versioned curated dataset plus provenance, split policy, coverage report, and known limitations.

## Stop conditions
Stop if provenance is unclear, sensitive data lacks authorization, split leakage cannot be controlled, or critical deployment conditions have no credible data.