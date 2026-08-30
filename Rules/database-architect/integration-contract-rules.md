# Integration Contracts

## Purpose
Keep database integrations stable, bounded, and evolvable.

## Scope
Database-facing APIs, views, CDC feeds, events, replicas, ETL consumers, and direct query integrations.

## MUST
- Every supported integration MUST define ownership, contract, compatibility expectations, and failure behavior.
- Change-data-capture and event consumers MUST define ordering, duplication, replay, and schema-evolution handling.
- Read replicas and exported views MUST document freshness guarantees and unsupported write behavior.
- Breaking contract changes MUST be versioned or coordinated with explicit consumer approval.

## MUST NOT
- MUST NOT expose unstable internal table layout as a de facto public contract without governance.
- MUST NOT assume exactly-once delivery where the platform does not guarantee it.
- MUST NOT allow external consumers to bypass integrity rules through unmanaged direct writes.

## SHOULD
- Prefer durable integration boundaries over ad hoc cross-database queries.
- Contracts SHOULD include data semantics, not only field names and types.

## Exceptions
Exceptions require dependency inventory, compatibility plan, risk, rollback, and owner approval.

## Verification
Review contracts, grants, CDC configuration, consumer tests, schema compatibility checks, and dependency maps.