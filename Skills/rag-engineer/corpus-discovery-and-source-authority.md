# Corpus Discovery and Source Authority

## Purpose
Establish which information may be retrieved, which source wins during conflict, and how corpus quality is governed.

## When to use
Use before ingestion, during corpus expansion, or when answers conflict across sources.

## Inputs
Source inventory, owners, data classifications, update frequencies, retention rules, sample documents, conflict examples.

## Context to inspect
Inspect system-of-record definitions, document lifecycle, permissions, duplication, timestamps, provenance fields, and known stale repositories.

## Core knowledge
RAG cannot compensate for an ambiguous source of truth. Authority, freshness, scope, and provenance must be modeled explicitly. Corpus inclusion is a product and governance decision, not just an indexing task.

## Procedure
1. Inventory candidate sources and owners.
2. Classify each source by authority, sensitivity, freshness, and scope.
3. Identify duplicates, derived copies, and contradictory records.
4. Define precedence rules for conflicts.
5. Define inclusion/exclusion and retention criteria.
6. Capture stable source identifiers and provenance.
7. Define deletion and correction propagation.
8. Sample content for extraction and retrieval suitability.
9. Record unsupported content types and gaps.
10. Obtain owner agreement for ambiguous authority rules.

## Decision points
Prefer canonical records over convenient copies. Retain multiple sources only when their perspectives are intentionally distinct and can be attributed.

## Common failure patterns
Indexing every available file; treating modification time as authority; losing provenance; retaining deleted content; mixing policy drafts with approved policy.

## Verification
Trace sampled indexed passages back to authoritative originals and test precedence, deletion, and update scenarios.

## Expected output
A governed corpus inventory with authority, provenance, lifecycle, and conflict rules.

## Stop conditions
Stop when source ownership or legal/security classification is unresolved.