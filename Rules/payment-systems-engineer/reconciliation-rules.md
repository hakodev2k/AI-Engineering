# Reconciliation Rules

## Purpose
Detect and resolve mismatches between internal financial records and external processors, banks, or networks.

## Scope
Authorizations, captures, refunds, fees, chargebacks, settlements, payouts, and balance movements.

## MUST
- Reconciliation MUST compare independent sources rather than two views derived from the same mutable record.
- Matching logic MUST define deterministic keys, tolerances, time windows, and duplicate handling.
- Unmatched, partially matched, and amount-mismatched items MUST be persisted with status and owner.
- Reconciliation jobs MUST be restartable without duplicating adjustments.
- Material breaks MUST trigger alerting and an escalation path with financial impact estimates.

## MUST NOT
- MUST NOT auto-write balancing entries merely to make reports agree without root-cause evidence.
- MUST NOT silently discard stale unmatched items.
- MUST NOT treat provider reports as infallible without validating completeness and period boundaries.

## SHOULD
- Reconciliation SHOULD run at a cadence aligned to settlement and business risk.

## Exceptions
Exceptions require documented rationale, residual-risk acceptance, and compensating manual control.

## Verification
Inspect source independence, match tests, unmatched aging, alert evidence, restart behavior, and closed-break documentation.