# Data Modeling and Schema Design

## Purpose
Design durable database schemas that preserve business meaning, integrity, evolvability, and efficient access patterns.

## When to use
Use for new domains, schema redesigns, major features, and reviews of structurally weak databases.

## Inputs
Business rules, entities, relationships, access patterns, scale expectations, retention requirements, and existing schema.

## Context to inspect
Inspect current tables, constraints, keys, naming conventions, ownership boundaries, query patterns, and migration history before proposing changes.

## Core knowledge
A Senior Database Engineer balances normalization, integrity, query efficiency, change cost, and operational safety. Logical models should represent business facts; physical models may optimize proven workloads without destroying semantics.

## Procedure
1. Clarify business invariants and lifecycle rules.
2. Identify entities, relationships, cardinality, and ownership.
3. Choose stable primary and candidate keys.
4. Normalize repeating or ambiguous facts.
5. Define nullability, defaults, checks, uniqueness, and referential constraints.
6. Validate data types, precision, time representation, and collation.
7. Map critical read/write access patterns.
8. Introduce denormalization only for measured needs with consistency ownership.
9. Design migration and backward-compatibility strategy.
10. Review the model with application and analytics consumers.

## Decision points
Prefer normalized authoritative data when consistency dominates. Denormalize when measured latency or reporting needs justify duplicated state and synchronization complexity.

## Common failure patterns
Meaningless generic tables, nullable-everything schemas, missing constraints, unstable natural keys used blindly, premature denormalization, and application-only integrity.

## Verification
Validate representative inserts, updates, deletes, constraint failures, critical queries, migration paths, and expected cardinalities.

## Expected output
A documented schema with keys, constraints, relationships, rationale, migration implications, and known trade-offs.

## Stop conditions
Escalate when business ownership or invariants are unresolved, required data would be destructively transformed, or compatibility cannot be preserved safely.