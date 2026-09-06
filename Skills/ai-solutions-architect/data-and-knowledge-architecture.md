# Data and Knowledge Architecture

## Purpose
Design the data and knowledge layer that supplies AI systems with reliable, governed, and appropriately fresh information.

## When to use
Use for solutions that depend on enterprise data, documents, event streams, knowledge bases, analytics platforms, or model feedback data.

## Inputs
Source systems, data models, ownership, update frequency, classification, retention rules, quality requirements, and consumption patterns.

## Context to inspect
Inspect schemas, lineage, source-of-truth ownership, data contracts, quality incidents, change cadence, access boundaries, and existing data platforms.

## Core knowledge
AI systems amplify upstream data defects. Architecture must distinguish transactional truth, analytical data, unstructured knowledge, derived features, conversation state, and evaluation datasets. Freshness, provenance, and access control are first-class design concerns.

## Procedure
1. Identify every data source and authoritative owner.
2. Classify data by sensitivity, structure, freshness, and usage.
3. Define ingestion or access patterns without unnecessary duplication.
4. Establish contracts for schema, metadata, lineage, and versioning.
5. Define quality checks and invalid-data handling.
6. Separate operational state from analytical and evaluation data.
7. Define retention, deletion, and archival behavior.
8. Map access rules to downstream AI components.
9. Design for source changes and backfills.
10. Document provenance for generated outputs where needed.

## Decision points
Prefer live API lookup for authoritative transactional facts, replicated stores for latency or resilience, and curated knowledge indexes for semantic retrieval. Avoid copying sensitive data unless the operational need is clear.

## Common failure patterns
No source ownership, stale indexes, hidden transformations, mixing training and production data casually, and treating all enterprise data as equally trustworthy.

## Verification
Validate lineage, freshness, quality controls, access rules, and representative end-to-end data flows.

## Expected output
A data architecture showing sources, ownership, transformations, stores, contracts, lineage, lifecycle, and controls.

## Stop conditions
Stop when source ownership is unknown, required data use is not approved, or data quality prevents reliable system behavior.