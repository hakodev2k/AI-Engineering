# Data Architecture

## Purpose
Define data ownership, storage boundaries, lifecycle, consistency, access patterns, lineage, and governance across a solution.

## When to use
Use for new platforms, domain decomposition, analytics integration, modernization, and systems with multiple stores or services.

## Inputs
Domain model, data classification, access patterns, retention, regulatory needs, reporting needs, volumes, consistency requirements.

## Preconditions
Business domains and system boundaries are understood.

## Context to inspect
Current databases, schemas, replication, ETL/ELT, master data, ownership, retention policy, backups, data residency, downstream consumers.

## Core knowledge
Storage technology follows access patterns and guarantees. Data ownership must be explicit. Shared databases create strong coupling. Analytical and transactional needs often differ.

## Procedure
1. Identify authoritative data owners by domain.
2. Classify sensitivity, residency, retention, and lifecycle.
3. Model read/write patterns and consistency requirements.
4. Select storage models based on workload characteristics.
5. Define cross-boundary data exchange.
6. Define identifiers and referential semantics.
7. Plan replication, caching, derived data, and reconciliation.
8. Define lineage and audit requirements.
9. Define backup, restore, archival, and deletion strategy.
10. Validate capacity, cost, and operational ownership.

## Decision points
Prefer one authoritative owner per mutable datum. Use polyglot persistence only where workload differences justify added complexity.

## Common failure patterns
Database-first design, shared ownership, uncontrolled copies, missing deletion propagation, no lineage, eventual consistency without reconciliation.

## Verification
Critical data has owner, classification, lifecycle, recovery method, consistency model, and access-path validation.

## Expected output
Data architecture model and governance decisions.

## Stop conditions
Stop when legal ownership, retention, or residency requirements are unresolved.