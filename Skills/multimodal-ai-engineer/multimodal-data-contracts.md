# Multimodal Data Contracts

## Purpose
Define durable contracts for multimodal datasets so images, audio, video, text, documents, and metadata can be ingested, versioned, validated, and consumed consistently across training, evaluation, and serving systems.

## When to use
Use when introducing a new modality, integrating multiple data sources, stabilizing a training corpus, or diagnosing incompatibilities between preprocessing and serving. Do not use as a replacement for domain-specific labeling guidelines.

## Inputs
- Source schemas and file formats
- Modality metadata
- Label definitions
- Storage and retention constraints
- Downstream training and serving requirements

## Preconditions
Identify authoritative sources and ownership for each modality and metadata field.

## Context to inspect
Inspect current schemas, encodings, timestamp semantics, coordinate systems, sampling rates, image dimensions, document page structure, identifiers, lineage fields, and downstream consumers.

## Core knowledge
Multimodal systems fail when seemingly compatible artifacts differ in hidden semantics. Contracts should specify representation, units, ordering, synchronization, provenance, nullability, quality bounds, and evolution rules. Schema compatibility includes semantic compatibility, not only syntactic validity.

## Procedure
1. Enumerate data entities and modalities.
2. Define stable identifiers and cross-modality linkage.
3. Specify file/container formats and codecs.
4. Define units, dimensions, sampling rates, coordinate conventions, and timestamps.
5. Define required metadata and lineage fields.
6. Specify null, missing, corrupt, and partial-input semantics.
7. Define validation constraints for size, duration, resolution, and encoding.
8. Establish schema versioning and backward-compatibility rules.
9. Separate source-native metadata from curated annotations.
10. Define retention and privacy classification.
11. Create validation examples for valid and invalid records.
12. Test all major producer-consumer paths against the contract.

## Decision points
Use self-describing formats when interoperability dominates. Use compact binary formats when throughput and storage efficiency matter. Prefer immutable raw artifacts plus versioned derived representations when reproducibility is important.

## Common failure patterns
- Joining modalities by unstable row order
- Ambiguous timestamp origins
- Silent codec conversion
- Unversioned preprocessing assumptions
- Conflating missing data with negative labels
- Metadata drift between training and serving

## Verification
Validate representative records from every source, run contract checks in CI/data pipelines, and confirm all downstream readers interpret fields consistently. Verify backward compatibility against at least one prior contract version when applicable.

## Expected output
A versioned multimodal data contract with schemas, semantics, constraints, examples, ownership, and compatibility rules.

## Stop conditions
Stop when source semantics are unknown, identifiers cannot reliably link modalities, or a schema change would break unmanaged consumers without a migration plan.