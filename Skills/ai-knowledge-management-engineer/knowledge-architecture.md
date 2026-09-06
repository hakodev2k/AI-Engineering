# Knowledge Architecture

## Purpose
Design the information architecture for AI-accessible organizational knowledge so retrieval, governance, ownership, and change remain understandable as the corpus grows.

## When to use
Use when starting a knowledge platform, restructuring a fragmented corpus, introducing RAG or enterprise search, or diagnosing poor retrieval caused by weak information structure. Do not use to impose a taxonomy before understanding real user tasks and source systems.

## Inputs
Business domains, user roles, knowledge sources, content types, ownership model, access rules, lifecycle requirements, retrieval use cases, and platform constraints.

## Preconditions
Major source systems and knowledge consumers are identifiable, and there is authority to define shared metadata or ownership conventions.

## Context to inspect
Inspect source repositories, document hierarchies, existing taxonomies, permissions, content lifecycles, search logs, common user questions, duplicate sources, and current ingestion pipelines.

## Core knowledge
Knowledge architecture connects domain boundaries, source authority, metadata, discoverability, permissions, provenance, and lifecycle. A strong design distinguishes canonical sources from replicas, stable identifiers from display names, and semantic organization from physical storage layout.

## Procedure
1. Identify the highest-value knowledge use cases and the decisions they support.
2. Inventory source systems and classify each by authority, freshness, structure, and sensitivity.
3. Define domain boundaries and ownership rather than organizing only by file location.
4. Establish stable content identifiers and source-of-truth rules.
5. Define required metadata for retrieval, filtering, access control, provenance, and lifecycle.
6. Map relationships among documents, entities, versions, and derived artifacts.
7. Define ingestion and synchronization boundaries for each source.
8. Decide where hierarchy, tags, graph relationships, or free-text semantics are most appropriate.
9. Document canonicalization, deprecation, archival, and deletion rules.
10. Validate the architecture against representative retrieval and governance scenarios.

## Decision points
Use hierarchical structures for durable domain organization, tags for cross-cutting facets, graphs for relationship-heavy reasoning, and semantic indexes for fuzzy retrieval. Avoid duplicating authoritative content merely to simplify indexing when references can preserve provenance.

## Common failure patterns
Mirroring folder structures as the knowledge model, unclear source authority, unstable identifiers, uncontrolled metadata fields, mixing access policy with presentation structure, and failing to model version lineage.

## Verification
Test representative content from multiple domains. Confirm every item has an owner, authority level, lifecycle state, stable identity, and enough metadata to enforce retrieval and policy constraints.

## Expected output
A reusable knowledge architecture specification covering domains, sources, identifiers, metadata, relationships, ownership, lifecycle, and integration boundaries.

## Stop conditions
Stop when source ownership is unresolved, legal retention rules conflict, permission semantics cannot be represented safely, or multiple teams claim authority for the same canonical knowledge without resolution.