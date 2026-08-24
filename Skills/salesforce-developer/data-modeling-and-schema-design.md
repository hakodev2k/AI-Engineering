# Data Modeling and Schema Design

## Purpose
Design Salesforce data models that support business semantics, ownership, automation, reporting, integrations, and high-volume access without creating avoidable limits or maintenance debt.

## When to use
Use for new objects, major relationship changes, external-system synchronization, archival strategies, and high-volume feature design.

## Inputs
Business entities, lifecycle, cardinality, ownership, reporting needs, integration keys, retention requirements, expected volumes.

## Preconditions
Business definitions and system-of-record responsibilities are sufficiently clear.

## Context to inspect
Existing standard/custom objects, master-detail and lookup relationships, record types, external IDs, unique constraints, sharing model, automation, reporting dependencies, package namespaces.

## Core knowledge
Salesforce schema decisions affect sharing, cascade behavior, rollups, storage, query selectivity, locking, and deployment compatibility. Master-detail creates stronger lifecycle/ownership coupling than lookup. External IDs and uniqueness constraints are key integration tools. Data skew can produce lock and performance failures.

## Procedure
1. Define entities and authoritative ownership.
2. Model lifecycle and cardinality before fields.
3. Reuse standard objects only when semantics genuinely match.
4. Choose lookup versus master-detail based on ownership, delete behavior, rollups, and requiredness.
5. Define external IDs and uniqueness where reconciliation needs them.
6. Identify high-volume objects and likely query predicates.
7. Evaluate ownership/account/lookup skew.
8. Minimize redundant derived data; use denormalization only for measured reasons.
9. Plan migrations, backfills, and rollback constraints.
10. Validate reporting, sharing, integration, and automation impacts.

## Decision points
Normalize when consistency and clear ownership dominate; denormalize when platform query or reporting constraints justify duplication. Prefer stable natural integration identifiers only when uniqueness and lifecycle are reliable.

## Common failure patterns
Using record type as a substitute for distinct domain models, excessive fields, overloaded objects, unindexed high-volume predicates, circular dependencies, and schema changes without migration plans.

## Verification
Validate metadata deployment, sample queries, sharing behavior, migration rehearsal, duplicate handling, and representative-volume performance.

## Expected output
Schema design with relationships, ownership, identifiers, migration plan, and documented scale risks.

## Stop conditions
Escalate when system-of-record ownership is disputed, retention/compliance rules are unresolved, or required relationships create unacceptable locking or sharing behavior.