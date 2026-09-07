# Benchmark Contamination Control

## Purpose
Prevent post-training data, synthetic-generation pipelines, and model-selection workflows from leaking evaluation answers or near-duplicates into training, preserving trustworthy measurement of generalization.

## When to use
Use whenever ingesting public corpora, benchmark-like tasks, generated reasoning data, preference prompts, or third-party datasets, and whenever suspicious benchmark jumps appear after post-training.

## Inputs
Training dataset manifests, evaluation suites, raw source metadata, generation prompts, semantic-similarity tooling, benchmark publication details, and model-training lineage.

## Preconditions
Dataset lineage is sufficiently traceable to identify sources and transformations, and protected evaluation sets can be access-controlled separately from training pipelines.

## Context to inspect
Inspect exact benchmark questions and variants where access is permitted, source URLs/identifiers, timestamps, generated-data prompts, deduplication thresholds, code/data repositories, previous evaluation exposure, and whether human or model annotators saw protected answers.

## Core knowledge
Contamination includes exact copies, paraphrases, solution traces, benchmark-specific templates, and generated examples derived from protected items. Exact string matching is necessary but insufficient. Semantic matching can overflag common patterns, so high-impact matches require review. Once a test set materially influences training or checkpoint selection, it is no longer an independent final evaluation.

## Procedure
1. Maintain a registry of protected evaluations and their access restrictions.
2. Record provenance for every training source and transformation.
3. Run exact normalization-based matching between candidate training data and protected items.
4. Add semantic or structural similarity checks for paraphrases, code tasks, and mathematical variants.
5. Inspect high-similarity matches manually or with a documented adjudication process.
6. Exclude direct answers, solutions, and generated derivatives of protected evaluation items.
7. Check synthetic-data prompts and seed examples for benchmark leakage.
8. Separate development evaluations used for iteration from untouched release holdouts.
9. Track who or what systems can access protected test data.
10. When a benchmark has influenced tuning decisions repeatedly, demote it to a development metric and introduce a fresh holdout.
11. Investigate unexpectedly large gains with per-item analysis and nearest-neighbor searches.
12. Version contamination reports alongside every final training dataset.

## Decision points
Use strict exclusion for high-value release benchmarks. For generic task patterns, exclude specific instances/solutions rather than entire useful domains. Treat uncertain high-similarity cases conservatively when benchmark integrity is more valuable than marginal training volume.

## Common failure patterns
Checking only exact text; assuming synthetic paraphrases are clean; using public benchmark solutions as instruction data; repeatedly tuning to a held-out score; losing provenance after dataset merging; treating no detected match as proof of no contamination.

## Verification
Verify protected-set access controls, exact and semantic scan results, adjudicated matches, dataset exclusions, and separation between development and release evaluations. Re-test suspicious gains on fresh or private tasks that measure the same capability.

## Expected output
A contamination-control report containing protected-set registry, scan methodology, detected/excluded matches, residual-risk assessment, and clean evaluation recommendations.

## Stop conditions
Stop a release claim based on affected benchmarks if material contamination cannot be ruled out, provenance is missing for major data sources, or protected answers were used directly in optimization or checkpoint selection.