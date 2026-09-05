# Graph Ingestion Pipelines

## Purpose
Design reliable pipelines that transform heterogeneous source data into graph entities and relationships while preserving semantics, provenance, idempotency, and data quality.

## When to use
Use for batch or streaming ingestion from databases, APIs, documents, event streams, or files into a knowledge graph.

## Inputs
Source schemas, change semantics, ontology, mapping rules, SLAs, data volumes, provenance requirements, error policy.

## Preconditions
Source ownership, identifiers, and expected update/delete behavior are known.

## Context to inspect
Existing ETL/ELT jobs, CDC feeds, mapping code, staging areas, checkpoints, retry logic, graph constraints, dead-letter handling.

## Core knowledge
Graph ingestion must preserve identity and relationship consistency across partial failures. Idempotency, late-arriving data, deletions, schema drift, and ordering are more important than raw throughput alone.

## Procedure
1. Profile source completeness, keys, and change semantics.
2. Define source-to-ontology mappings.
3. Normalize identifiers and controlled values.
4. Stage transformations before graph mutation.
5. Apply entity resolution where required.
6. Upsert nodes before dependent edges.
7. Record provenance and source timestamps.
8. Handle retries idempotently.
9. Quarantine invalid records with reasons.
10. Reconcile source and graph counts/checksums.
11. Monitor freshness, lag, failures, and schema drift.

## Decision points
Use batch loading for large stable snapshots and streaming/CDC when freshness matters. Prefer staging and atomic partitions for complex multi-entity updates.

## Common failure patterns
Duplicate nodes on retries, orphan edges, ignored deletions, overwriting newer data with late events, silent schema drift, and losing source lineage.

## Verification
Replay the same batch without duplication, reconcile expected entities/edges, test deletes and late events, and validate constraints after load.

## Expected output
An observable, idempotent ingestion pipeline with mappings, checkpoints, quarantine flow, reconciliation, and runbook.

## Stop conditions
Escalate when source identity is unstable, destructive synchronization is ambiguous, or source changes invalidate graph semantics.