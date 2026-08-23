# Data Integrity Incident Rules

## Purpose
Prevent recovery actions from compounding corruption, loss, duplication, or inconsistent business state.

## Scope
Suspected data corruption, partial writes, replay, duplication, stale state, destructive jobs, and restoration.

## MUST
- Distinguish availability restoration from data-integrity restoration and track both explicitly.
- Stop or isolate known corruption sources before bulk repair when practical.
- Determine affected data scope, authoritative source, recovery point, reconciliation method, and validation criteria.
- Require human approval before destructive repair, deletion, irreversible transformation, or restoration that overwrites newer data.
- Preserve auditability of repair operations.

## MUST NOT
- Mass-update production data from an unvalidated script or sample-based assumption.
- Claim integrity is restored solely because application errors stopped.

## SHOULD
- Use dry runs, bounded batches, idempotent repair operations, backups, and reconciliation reports.

## Exceptions
Immediate isolation or write suspension may precede full analysis to prevent further corruption.

## Verification
Compare authoritative records, reconciliation totals, invariants, audit logs, repair outputs, and representative end-to-end business cases.