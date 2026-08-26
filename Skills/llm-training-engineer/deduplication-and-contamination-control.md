# Deduplication and Contamination Control

## Purpose
Reduce memorization-inducing duplication and prevent protected evaluation content from entering training corpora.

## When to use
Use before every major corpus release and whenever new data sources or evaluation suites are introduced.

## Inputs
Training corpus, document identifiers, evaluation sets, normalization rules, hashing/minhash tooling, similarity thresholds, lineage metadata.

## Context to inspect
Exact and near-duplicate prevalence, mirrored sites, code forks, benchmark variants, prompt/answer transformations, and train-test chronology.

## Core knowledge
Exact hashing misses transformed copies; overly broad fuzzy matching removes legitimate related material. Contamination detection must consider normalization, substrings, paraphrased benchmark wrappers, and benchmark answers embedded in explanations.

## Procedure
1. Define document and span normalization rules.
2. Remove exact duplicates with deterministic fingerprints.
3. Detect near duplicates using scalable similarity methods.
4. Choose canonical representatives with quality/provenance rules.
5. Build protected evaluation fingerprints and variants.
6. Scan training candidates for exact and approximate overlap.
7. Quarantine suspicious matches for review.
8. Record removal reason and lineage.
9. Measure residual duplication and contamination rates.
10. Re-run scans after any corpus merge.

## Decision points
Use document-level deduplication for replicated sources and span-level methods when templated pages dominate. Tighten thresholds for protected benchmarks; use manual review for ambiguous high-impact matches.

## Common failure patterns
Deduplicating after sampling; ignoring benchmark mirrors; hashing without normalization; deleting all semantically similar documents; losing provenance needed to explain removals.

## Verification
Independent scans find no known protected exact matches, sampled fuzzy matches are reviewed, duplicate-rate metrics improve, and the corpus can be reconstructed from lineage records.

## Expected output
A deduplicated corpus manifest plus contamination report, thresholds, quarantines, and audit evidence.

## Stop conditions
Stop when protected data is confirmed in a released corpus, similarity thresholds are unvalidated, or removals cannot be traced.