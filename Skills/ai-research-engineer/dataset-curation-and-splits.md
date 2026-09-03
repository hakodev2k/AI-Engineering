# Dataset Curation and Splits

## Purpose
Design and validate research datasets and split strategies so measured progress reflects generalization rather than leakage, duplication, distribution artifacts, or evaluation overfitting.

## When to use
Use when creating a benchmark, training a new model, adapting a public dataset, combining multiple corpora, or investigating unexpectedly strong results.

## Inputs
- Raw data sources
- Task definition
- Existing dataset licenses and provenance
- Candidate train/validation/test splits
- Deduplication and filtering tools
- Evaluation requirements

## Preconditions
Define the intended deployment or research distribution and what forms of generalization matter: random-example, temporal, entity, domain, language, user, geographic, or compositional.

## Context to inspect
Inspect provenance, licenses, collection date, duplicates, near-duplicates, label generation, annotation guidelines, class balance, sensitive attributes, benchmark exposure, contamination with pretraining corpora where assessable, and transformations applied before storage.

## Core knowledge
Random splits are often insufficient for modern AI because correlated examples can cross boundaries. Split design should model the claim being made. Data cleaning can remove valuable hard cases, while aggressive filtering can shift the distribution. Dataset quality includes provenance, representativeness, label reliability, leakage resistance, and reproducibility.

## Procedure
1. Define the target population and out-of-scope population.
2. Inventory all source datasets and provenance.
3. Validate legal, licensing, privacy, and consent constraints.
4. Profile duplicates, near-duplicates, label frequencies, sequence lengths, domains, and key metadata.
5. Identify grouping keys that must not cross splits, such as document, user, repository, patient, product, or conversation.
6. Decide whether time-based or domain-held-out evaluation better represents the research claim.
7. Deduplicate before split assignment when possible.
8. Construct train, validation, and untouched test partitions.
9. Add challenge or stress-test slices for known difficult conditions.
10. Freeze test data and restrict iterative access.
11. Run contamination checks against training sources and known benchmark material.
12. Verify that preprocessing is applied consistently and does not leak labels or future information.
13. Measure distribution differences between splits.
14. Version manifests and filtering logic.
15. Document exclusions and their rationale.

## Decision points
- Prefer group-aware splits when examples share latent identity or source.
- Prefer temporal splits for forecasting or evolving-domain claims.
- Keep naturally difficult examples unless they are invalid, rather than cleaning toward an artificially easy benchmark.
- Use stratification only when it preserves the real target distribution or when the evaluation explicitly reports reweighted results.

## Common failure patterns
- Deduplicating after splitting and leaving near-duplicates across partitions.
- Repeatedly inspecting the test set during development.
- Mixing synthetic and human data without tracking provenance.
- Allowing preprocessing to incorporate target labels or future context.
- Removing rare classes because they hurt aggregate metrics.
- Publishing results without recording the exact dataset revision.

## Verification
Implementation is complete when versioned manifests and preprocessing can recreate all splits. Verification requires leakage checks, distribution reports, provenance coverage, license/privacy review, and a demonstration that grouping and temporal constraints hold for every partition.

## Expected output
Versioned dataset manifests, split logic, provenance and license notes, distribution diagnostics, contamination results, challenge slices, and documented limitations.

## Stop conditions
Stop and escalate when provenance is unknown for material portions of data, license or consent is incompatible with use, sensitive information cannot be handled safely, leakage cannot be bounded, or the available data cannot support the intended generalization claim.