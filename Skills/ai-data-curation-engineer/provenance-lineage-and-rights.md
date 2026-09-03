# Provenance, Lineage, and Rights

## Purpose
Make every dataset component traceable to its origin, transformations, usage rights, and policy constraints so model training and downstream release decisions are defensible.

## When to use
Use for any training, fine-tuning, preference, evaluation, or retrieval corpus assembled from multiple sources or transformation stages.

## Inputs
Source records, licenses or agreements, transformation logs, dataset manifests, identifiers, timestamps, and policy requirements.

## Context to inspect
Inspect ingestion code, metadata schemas, storage layout, derived datasets, source-specific restrictions, deletion workflows, and downstream consumers.

## Core knowledge
Lineage must survive copying, filtering, deduplication, normalization, labeling, and mixture assembly. Rights can differ by source, jurisdiction, purpose, output type, and retention period. Provenance should support both forward tracing from source to descendants and backward tracing from an example to its origin.

## Procedure
1. Define stable source and example identifiers.
2. Record source owner, acquisition method, timestamp, and governing terms.
3. Attach rights, privacy, retention, and redistribution metadata.
4. Record every transformation with versioned code or configuration.
5. Preserve parent-child relationships through derived datasets.
6. Propagate restrictive metadata through merges and exports.
7. Test deletion and exclusion propagation.
8. Generate dataset-level lineage summaries.
9. Audit a random sample end-to-end.
10. Block release when lineage is incomplete for restricted material.

## Decision points
Use example-level lineage when legal removal, contamination analysis, or source weighting requires precision. Dataset-level lineage may suffice for homogeneous, fully controlled first-party sources.

## Common failure patterns
- Storing only a source URL
- Losing lineage after deduplication or shuffling
- Failing to propagate restrictive rights
- Treating derived data as rights-free
- Using mutable identifiers

## Verification
Implemented means lineage metadata is captured. Verified means sampled examples can be traced backward and source removals can be propagated forward without orphaned restricted copies.

## Expected output
A versioned lineage graph or manifest with source, rights, transformations, descendants, and audit evidence.

## Stop conditions
Stop when source ownership or usage rights cannot be established, mandatory lineage fields are missing, or a requested export would violate recorded restrictions.