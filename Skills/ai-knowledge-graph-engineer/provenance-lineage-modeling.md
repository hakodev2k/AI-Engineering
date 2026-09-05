# Provenance and Lineage Modeling

## Purpose
Make graph facts auditable by recording where assertions came from, when they were observed, how they were transformed, and how confident the system is in them.

## When to use
Use when facts originate from multiple sources, AI extraction, regulated data, changing documents, or workflows requiring explainability.

## Inputs
Source identifiers, extraction metadata, timestamps, transformation steps, confidence, ownership, retention rules.

## Preconditions
Define the granularity at which provenance must be queryable.

## Context to inspect
Current edge/property provenance, source catalog, ingestion metadata, extraction models, audit requirements, temporal model.

## Core knowledge
Statement-level provenance is more precise but expensive; entity-level provenance is cheaper but can obscure conflicting facts. Provenance should distinguish source evidence from processing metadata and confidence.

## Procedure
1. Identify assertions requiring lineage.
2. Define source and processing identifiers.
3. Choose entity-, edge-, or statement-level provenance.
4. Record observed-at and valid-time semantics where relevant.
5. Preserve extraction/model versions.
6. Represent conflicting assertions without destructive overwrite.
7. Define confidence semantics explicitly.
8. Propagate lineage through transformations.
9. Test provenance queries and retention behavior.
10. Document provenance conventions.

## Decision points
Use statement-level provenance for high-risk or conflicting facts; aggregate provenance where cost outweighs audit value.

## Common failure patterns
A single generic source field, overwriting competing facts, mixing confidence with truth, losing model versions, and omitting transformation lineage.

## Verification
Trace representative graph facts back to raw evidence and transformation history, including conflicting sources.

## Expected output
A provenance model, lineage mappings, query examples, retention rules, and validation tests.

## Stop conditions
Escalate when required provenance conflicts with privacy, retention, or legal constraints.