# Data Migration Rules

## Purpose
Move data between storage systems without silent loss, corruption, unacceptable downtime, or uncontrolled rollback risk.

## Scope
Online/offline migration, replication cutover, copy, rehydration, tier movement, and decommissioning.

## MUST
- Migration plans MUST define source of truth, consistency method, validation, cutover, rollback, and ownership.
- Data completeness and integrity MUST be verified before declaring migration complete.
- Cutover criteria MUST include application behavior and performance, not only copy completion.
- Source retirement MUST wait until recovery and rollback obligations are satisfied.

## MUST NOT
- MUST NOT perform irreversible production cutover or source deletion without human approval.
- MUST NOT use unvalidated copy counts as proof of semantic data equivalence.
- MUST NOT ignore permissions, metadata, timestamps, retention, or object/version semantics relevant to consumers.

## SHOULD
- Prefer staged, resumable, observable migrations with bounded blast radius.

## Exceptions
Any skipped validation requires quantified residual risk and accountable approval.

## Verification
Review manifests, checksums, reconciliation reports, application tests, cutover records, and rollback readiness.