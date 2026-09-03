# Deduplication and Near-Duplicate Detection

## Purpose
Reduce exact and semantic duplication so training signal is not dominated by repeated content, leakage, templated artifacts, or replicated sources.

## When to use
Use on large web corpora, merged datasets, synthetic datasets, benchmark-adjacent collections, or whenever repeated examples may distort weighting or contamination risk.

## Inputs
Dataset records, provenance, modality-specific representations, candidate similarity methods, protected holdouts, and compute budget.

## Context to inspect
Inspect source overlap, chunking policy, normalization, dataset splits, model tokenizer or embedding choice, benchmark corpus, and downstream mixture weights.

## Core knowledge
Exact hashing catches byte-identical records but misses formatting and semantic variants. MinHash/LSH, n-gram similarity, perceptual hashes, embeddings, and locality-sensitive indexes trade recall, precision, and cost differently. Deduplication changes source and domain distributions, so removals must be measured by slice.

## Procedure
1. Define duplicate semantics for the task.
2. Normalize only fields appropriate for comparison.
3. Remove exact duplicates with stable hashes.
4. Select near-duplicate features and thresholds on labeled pairs.
5. Build candidate groups efficiently.
6. Choose canonical examples using provenance, quality, or freshness.
7. Deduplicate across train/eval boundaries with stricter rules.
8. Record cluster membership and retained representative.
9. Measure removal rates by source, language, domain, and quality band.
10. Audit false merges and missed duplicates.

## Decision points
Use lexical methods when wording identity matters; semantic methods when paraphrases create equivalent training signal. Prefer conservative thresholds when false merges would erase rare knowledge. Use stricter exclusion against protected evaluations.

## Common failure patterns
- Deduplicating only within individual files
- Using one threshold across modalities or languages
- Removing rare examples because they resemble common templates
- Losing provenance for discarded members
- Forgetting cross-split deduplication

## Verification
Implemented means duplicate clusters are produced reproducibly. Verified means precision/recall on reviewed pairs is acceptable, cross-split leakage is controlled, and distribution shifts are understood.

## Expected output
Deduplicated dataset, cluster manifest, threshold rationale, slice statistics, and audit report.

## Stop conditions
Stop when similarity thresholds are not validated, canonical selection would violate source restrictions, or protected evaluation material cannot be reliably identified.