# Embedding Schema Design

## Purpose
Design durable schemas for vectors, source records, metadata, versions, and lifecycle state so retrieval remains explainable and evolvable.

## When to use
Use when creating a collection/table, adding a new embedding model, or correcting schema limitations.

## Inputs
Source entity model, embedding model and dimension, tenant model, metadata/filter requirements, retention rules, update semantics, and query patterns.

## Context to inspect
Inspect source-of-truth identifiers, existing schemas, embedding generation code, metadata cardinality, partition keys, retention policies, and downstream consumers.

## Core knowledge
Vectors are derived data. Store stable source identity and enough provenance to reproduce them. Model/version changes can make vectors incomparable. Metadata used for filtering must be typed and indexed appropriately. Tenant boundaries and deletion requirements belong in the schema, not only application code.

## Procedure
1. Identify the authoritative source entity and stable key.
2. Define vector field(s), dimensions, metric compatibility, and nullability.
3. Record embedding model/version and transformation version.
4. Separate retrieval metadata from large payloads when beneficial.
5. Define tenant, namespace, security, and lifecycle fields.
6. Define created/updated timestamps and source revision.
7. Decide whether multiple embedding generations coexist during migration.
8. Define uniqueness and idempotent upsert keys.
9. Validate filterable fields against query patterns.
10. Define deletion/tombstone behavior and retention.
11. Test schema evolution with representative migrations.

## Decision points
Use one collection per workload when isolation or incompatible vector semantics justify it; otherwise prefer shared schemas with explicit namespaces. Store payloads inline for low-latency self-contained reads, but externalize large/volatile payloads when duplication and update cost dominate.

## Common failure patterns
Using random IDs without source mapping; omitting model version; mixing incompatible embeddings; unbounded metadata; tenant filtering only in callers; ambiguous update semantics; storing secrets or unnecessary sensitive data; schema tied to one temporary ingestion format.

## Verification
Round-trip representative entities, verify idempotent upserts, filtering, tenant isolation, deletion, version coexistence, and reconstruction of embedding provenance.

## Expected output
A schema definition plus documented identity, provenance, filtering, tenancy, migration, and lifecycle rules.

## Stop conditions
Stop when source identity is unstable, tenant/security requirements are unresolved, or embedding dimensions/model are not known.