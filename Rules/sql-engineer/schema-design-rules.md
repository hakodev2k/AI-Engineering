# Schema Design Rules

## Purpose
Create schemas that preserve semantics, support expected workloads, and evolve safely.

## Scope
Tables, columns, keys, relationships, data types, normalization, denormalization, and naming.

## MUST
- Every persisted attribute MUST have a data type, nullability, key relationship, and semantic meaning appropriate to the domain.
- Schema design MUST account for expected cardinality, retention, access patterns, and growth.
- Denormalization MUST identify the source of truth and consistency mechanism.
- Shared schema changes MUST assess downstream contracts and compatibility.

## MUST NOT
- MUST NOT encode multiple unrelated facts in overloaded columns or magic sentinel values where explicit modeling is feasible.
- MUST NOT choose unbounded or oversized types by default when they materially harm validation, indexing, or storage.
- MUST NOT introduce redundant persisted facts without a synchronization strategy.

## SHOULD
- Normalize mutable business facts unless measured workload or operational constraints justify another model.
- Prefer stable surrogate or natural keys based on domain and integration requirements, not habit.

## Exceptions
Departures require documented workload evidence, alternatives, consistency risks, migration impact, and ownership.

## Verification
Review DDL, cardinality assumptions, sample workloads, constraints, index feasibility, storage estimates, and compatibility with existing consumers. Validate representative edge cases and expected future growth.