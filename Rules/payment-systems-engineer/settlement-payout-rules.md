# Settlement and Payout Rules

## Purpose
Maintain correct movement from captured payments through settlement and payout.

## Scope
Processor settlement, merchant balances, fees, reserves, payout scheduling, bank transfers, and payout failures.

## MUST
- Settlement records MUST preserve gross amount, fees, adjustments, net amount, currency, provider batch or reference, and effective dates.
- Payout eligibility MUST be derived from settled or otherwise explicitly available funds according to documented business rules.
- Payout creation MUST be idempotent and linked to the exact balance movements it consumes.
- Failed or returned payouts MUST create explicit recovery states and financial entries.
- Settlement and payout totals MUST be reconciled against independent provider or banking reports.

## MUST NOT
- MUST NOT pay out funds merely because a customer payment was authorized.
- MUST NOT overwrite payout history when bank or provider status changes.
- MUST NOT silently net unexplained discrepancies into later payouts.

## SHOULD
- Payout schedules SHOULD make cutoffs, holidays, and timezone assumptions explicit.

## Exceptions
Exceptions require treasury or finance approval and documented reconciliation controls.

## Verification
Inspect settlement batches, payout linkage, failure recovery, cutoff tests, and reconciliation evidence.