# Data Cleaning and Normalization

## Purpose
Remove corruption and normalize representation without erasing signal that the target model should learn.

## When to use
Use after ingestion, before deduplication or labeling, when raw data contains malformed records, encoding problems, markup noise, broken media, inconsistent schemas, or source-specific artifacts.

## Inputs
Raw dataset, schema, source metadata, target model constraints, cleaning policy, representative samples, and known edge cases.

## Context to inspect
Inspect parsers, tokenization or modality preprocessing, source distributions, downstream filters, language detection, metadata preservation, and previous cleaning statistics.

## Core knowledge
Cleaning is an information transformation. Aggressive normalization can destroy code formatting, punctuation, dialect, document structure, image detail, or audio characteristics that matter. Rules must be observable, versioned, and reversible where practical.

## Procedure
1. Profile malformed, missing, outlier, and low-information records.
2. Classify defects by source and impact.
3. Define deterministic normalization rules.
4. Preserve original identifiers and provenance.
5. Apply encoding, whitespace, markup, schema, and media repairs appropriate to the modality.
6. Quarantine rather than silently repair ambiguous corruption.
7. Record per-rule counts and examples.
8. Compare before/after distributions.
9. Sample false-positive removals and destructive transformations.
10. Version the cleaning pipeline and output manifest.

## Decision points
Normalize only when representation variance is nuisance rather than useful signal. Repair recoverable corruption when correctness is testable; quarantine uncertain cases. Keep raw snapshots when future reprocessing is likely.

## Common failure patterns
- Removing nonstandard language as noise
- Destroying structural formatting
- Silent coercion of invalid fields
- Applying text rules to code or markup indiscriminately
- Failing to preserve raw data and lineage

## Verification
Implemented means the pipeline runs deterministically. Verified means corruption decreases, required distributions remain intact, sampled valid content is not systematically lost, and downstream parsers accept the cleaned corpus.

## Expected output
A cleaned, versioned dataset plus transformation statistics, quarantined records, audit samples, and rule configuration.

## Stop conditions
Stop when cleaning rules materially alter task semantics, source formats cannot be reliably parsed, or quality cannot be measured against representative samples.