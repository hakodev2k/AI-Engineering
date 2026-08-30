# Data Architecture Governance

## Purpose
Guide cross-team decisions about data ownership, system-of-record boundaries, consistency, schemas, retention, and access so data remains trustworthy and evolvable.

## When to use
Use for shared operational data, cross-domain analytics dependencies, data duplication, ownership disputes, or major storage and eventing changes.

## Inputs
Data flows, schemas, ownership map, consistency requirements, retention rules, privacy classification, consumers, SLAs.

## Preconditions
Key data domains and accountable system owners can be identified.

## Context to inspect
Source-of-truth systems, replication paths, CDC or event pipelines, data contracts, access policies, lineage, reconciliation jobs, and known integrity incidents.

## Core knowledge
Data architecture should make authority explicit. Replication is not ownership. Consistency, availability, latency, privacy, and autonomy trade against one another; cross-domain data needs contracts and reconciliation strategies.

## Procedure
1. Identify business entities and authoritative owners.
2. Map reads, writes, copies, and transformations.
3. Define consistency and freshness requirements by use case.
4. Remove ambiguous multi-writer ownership where possible.
5. Define schemas and compatibility expectations.
6. Design replication, reconciliation, and failure handling.
7. Apply access, retention, and privacy controls.
8. Add lineage and integrity observability.
9. Review changes with producers and consumers.

## Decision points
Keep strong consistency where invariants require it. Use eventual consistency when latency and autonomy benefits justify reconciliation complexity. Duplicate data for read needs only with explicit ownership and freshness semantics.

## Common failure patterns
Shared tables across domains, unknown systems of record, dual writes without reconciliation, undocumented schema semantics, unrestricted sensitive-data propagation, and stale replicas treated as authoritative.

## Verification
Validate ownership, reconciliation tests, lineage, access controls, schema compatibility, and integrity under partial failure.

## Expected output
A data architecture decision set covering authority, contracts, consistency, replication, governance, and operational verification.

## Stop conditions
Escalate when regulatory data requirements, destructive migrations, or unresolved ownership make a safe design impossible.