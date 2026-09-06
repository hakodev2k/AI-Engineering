# Source Authority and Provenance

## Purpose
Establish which knowledge sources are authoritative and preserve provenance so AI answers can be traced, challenged, and updated safely.

## When to use
Use when multiple systems contain overlapping facts, users need citations, policies require traceability, or stale replicas create conflicting answers.

## Inputs
Source inventory, ownership, update cadence, business criticality, legal status, document versions, and downstream retrieval flows.

## Context to inspect
Inspect duplicate documents, source timestamps, approval workflows, owners, links among originals and copies, retrieval citations, and known conflicts.

## Core knowledge
Authority is contextual: a source may be canonical for policy but not operational status. Provenance should capture origin, version, transformation lineage, timestamps, and derived artifacts. Derived summaries should never silently replace originals as the source of truth.

## Procedure
1. Inventory overlapping sources for each knowledge domain.
2. Identify accountable owners and canonical systems.
3. Define authority tiers and tie-break rules for conflicts.
4. Record source identity, version, publication and ingestion timestamps.
5. Preserve transformation lineage from raw object to normalized document, chunk, index record, and answer citation.
6. Mark derived, user-generated, archived, or superseded content explicitly.
7. Exclude or down-rank non-authoritative replicas where appropriate.
8. Detect conflicting facts and surface them rather than silently choosing when rules are unclear.
9. Expose provenance to evaluation, debugging, and user-facing citation layers.
10. Review authority rules when ownership or systems change.

## Decision points
Prefer canonical systems for factual claims; allow secondary sources for discovery or contextual evidence when their status is visible. Escalate unresolved contradictions in high-impact domains.

## Common failure patterns
Treating the newest document as authoritative by default, losing original URLs during transformation, citing summaries as primary evidence, and failing to invalidate superseded content.

## Verification
Trace sampled answers back to raw authoritative objects, reproduce the transformation chain, and test conflict scenarios and superseded versions.

## Expected output
Authority rules, provenance metadata, conflict handling, and traceability evidence across the knowledge pipeline.

## Stop conditions
Stop when ownership is disputed, canonical status cannot be established for high-risk knowledge, or provenance is lost irreversibly during ingestion.