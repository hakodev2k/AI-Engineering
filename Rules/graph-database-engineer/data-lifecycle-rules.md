# Data Lifecycle Rules

## Purpose
Control creation, evolution, retention, archival, and deletion of graph data without leaving inconsistent connected state.

## Scope
TTL, retention, archival, deletion, tombstones, derived relationships, historical versions, and downstream copies.

## MUST
- Define ownership and lifecycle for each material entity and relationship type.
- Specify what happens to incident relationships, derived data, indexes, projections, and exports when an entity is deleted.
- Make bulk deletion bounded, auditable, and recoverable where required.
- Require human approval for destructive production deletion with material impact.
- Verify retention and deletion against applicable project requirements.

## MUST NOT
- Cascade-delete connected graph data without explicit semantics and impact analysis.
- Leave orphaned relationships or stale derived structures when the database model forbids them.
- Claim deletion completion without accounting for replicas, exports, caches, and backup policy.

## SHOULD
- Prefer explicit archival or tombstone states when auditability or asynchronous cleanup is required.
- Automate lifecycle checks for aged or orphaned data.

## Exceptions
Extended retention requires documented purpose, risk, access controls, duration, and approval where applicable.

## Verification
Run orphan scans, lifecycle integration tests, retention audits, deletion reconciliation, export checks, and sampled provenance reviews. Inspect audit logs for destructive operations.