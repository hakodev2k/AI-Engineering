# Consistency and Freshness

## Purpose
Make visibility, replication, update, and deletion behavior explicit to consumers.

## Scope
Applies to read-after-write behavior, replicas, asynchronous indexing, CDC, deletes, and freshness SLOs.

## MUST
- Systems MUST define expected write visibility, replication lag, deletion propagation, and stale-read behavior.
- User-facing freshness guarantees MUST be measurable and monitored.
- Workflows requiring read-after-write semantics MUST use a mechanism that actually provides or verifies that guarantee.
- Delete propagation MUST satisfy applicable privacy, security, and product requirements.
- Recovery and failover procedures MUST state how consistency and freshness can temporarily change.

## MUST NOT
- MUST NOT promise immediate visibility on an eventually consistent path without verification.
- MUST NOT treat successful source writes as proof that vector indexes are current.
- MUST NOT leave deleted sensitive records searchable beyond the approved propagation window.

## SHOULD
- Freshness lag SHOULD be measured end-to-end from authoritative source change to searchable state.
- Consumers SHOULD receive explicit degraded-state signals when freshness objectives are violated.
- Reconciliation SHOULD detect long-lived divergence.

## Exceptions
Exceptions require documented business impact, duration, compensating controls, evidence, and approval when contractual or privacy guarantees are affected.

## Verification
Inspect SLOs, lag metrics, read-after-write tests, deletion tests, replication dashboards, failover exercises, and reconciliation outputs.