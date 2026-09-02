# Provenance and Lineage

## Purpose
Make every important graph fact traceable to its source, transformation, confidence, and effective time so users can audit, reconcile, and safely update knowledge.

## When to use
Use when multiple sources contribute facts, data is regulated, assertions can conflict, or downstream systems need explainability.

## Inputs
Source identifiers, ingestion metadata, transformation rules, assertion model, timestamps, confidence, and governance requirements.

## Preconditions
Define whether provenance applies at graph, entity, statement, or property level and what retention is required.

## Context to inspect
Current source metadata, transformation jobs, conflicting facts, manual edits, lineage systems, and query requirements for audit.

## Core knowledge
Provenance should distinguish source occurrence from canonical assertion. Statement-level provenance is more precise but more expensive. Lineage must survive merges, transformations, and reprocessing.

## Procedure
1. Identify decisions that require traceability.
2. Define stable source and pipeline identifiers.
3. Choose provenance granularity by risk and cost.
4. Record source timestamps separately from ingestion time.
5. Capture transformation/version metadata.
6. Model confidence and assertion authority explicitly where needed.
7. Preserve provenance through entity merges and derived facts.
8. Define conflict-resolution rules without deleting competing evidence.
9. Expose provenance in operational and audit queries.
10. Test replay and historical reconstruction.

## Decision points
Use statement-level provenance for high-value or contested facts; coarser provenance for low-risk bulk data. Preserve conflicting claims when authoritative truth cannot be safely determined.

## Common failure patterns
Overwriting source facts with canonical values; losing lineage after entity resolution; using ingestion time as event time; unversioned transformation logic; and provenance too coarse to explain a result.

## Verification
Trace representative facts end-to-end, reconstruct prior states, verify source/version metadata, and test conflict scenarios.

## Expected output
A provenance model, lineage capture rules, conflict policy, and audit queries.

## Stop conditions
Stop when required source metadata is unavailable or retention obligations conflict with privacy/deletion requirements without governance resolution.