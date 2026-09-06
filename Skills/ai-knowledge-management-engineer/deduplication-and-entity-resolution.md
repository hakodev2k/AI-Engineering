# Deduplication and Entity Resolution

## Purpose
Detect duplicate or near-duplicate knowledge and resolve references to the same real-world entity so retrieval does not amplify redundant or conflicting evidence.

## When to use
Use when corpora contain copied documents, exports, mirrors, renamed files, repeated policies, or inconsistent entity identifiers.

## Inputs
Document IDs, source metadata, normalized text, hashes, timestamps, entity fields, embeddings, and source authority rules.

## Context to inspect
Inspect duplicate rates, mirrored sources, canonical URLs, revision histories, retrieval result repetition, and ambiguous entity names.

## Core knowledge
Exact hashing catches byte-equivalent content; normalized hashes catch formatting-only changes; similarity methods catch near duplicates. Entity resolution should combine deterministic identifiers with cautious probabilistic matching. Deduplication must not destroy distinct versions that matter temporally or legally.

## Procedure
1. Define what counts as duplicate, version, derivative, or independent corroboration.
2. Normalize stable text and metadata for comparison.
3. Apply exact identifiers and hashes first.
4. Use similarity detection for likely near duplicates.
5. Cluster candidates and choose canonical records using authority and freshness rules.
6. Preserve aliases and lineage rather than deleting relationships blindly.
7. Resolve entities using authoritative IDs when available.
8. Apply probabilistic matching only with confidence thresholds and review paths.
9. Collapse duplicate retrieval candidates while retaining provenance.
10. Re-evaluate clusters when source versions or authority change.

## Decision points
Keep separate records when versions have different effective dates or when independent evidence is meaningful. Merge only when identity is sufficiently proven.

## Common failure patterns
Deduplicating by filename, merging distinct policies with similar wording, deleting provenance, entity matching on names alone, and allowing copies to crowd out diverse evidence.

## Verification
Sample duplicate clusters, verify canonical selection, test ambiguous entities, and measure reduction in redundant retrieval without loss of relevant evidence.

## Expected output
Deduplication rules, canonical mappings, entity-resolution thresholds, lineage, and quality metrics.

## Stop conditions
Stop when merging could alter legally significant versions, entity identity is materially ambiguous, or canonical source authority is unresolved.