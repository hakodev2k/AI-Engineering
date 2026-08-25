# Disaster Recovery Rules

## Purpose
Make recovery from regional, cluster-wide, or catastrophic loss executable and evidence-based.

## Scope
Applies to replication, backup/archive, cross-region recovery, metadata, schemas, offsets, and state stores.

## MUST
- Critical streaming services MUST define RPO and RTO for event data, schemas, consumer progress, and processing state.
- Recovery design MUST identify which metadata and dependencies are required in addition to event payloads.
- Cross-region replication MUST document ordering, lag, failover, failback, and duplicate implications.
- Recovery procedures MUST be exercised periodically and measured against objectives.
- Disaster failover or destructive restoration in production MUST require human authorization.

## MUST NOT
- MUST NOT claim recoverability based solely on configured replication.
- MUST NOT omit schema registry, credentials/identity, topic configuration, or state-store recovery from DR planning.
- MUST NOT assume consumer offsets can be reconstructed safely without a defined method.
- MUST NOT perform untested failback that can create split-brain processing.

## SHOULD
- Recovery automation SHOULD be idempotent, auditable, and capable of validation before traffic cutover.
- Critical archives SHOULD be independently protected from the primary failure domain.

## Exceptions
Manual recovery steps are acceptable when documented, rehearsed, time-bounded within RTO, and assigned to named operational roles.

## Verification
Conduct DR exercises, validate restored data/configuration, measure RPO/RTO, reconcile outputs, and inspect failover/failback audit evidence.