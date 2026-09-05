# Refund and Dispute Rules

## Purpose
Keep reversals, refunds, chargebacks, and disputes financially correct and auditable.

## Scope
Full and partial refunds, reversals, chargebacks, dispute evidence, and related ledger effects.

## MUST
- Refund eligibility and remaining refundable amount MUST be validated against authoritative transaction state.
- Partial refunds MUST preserve exact cumulative totals and prevent over-refund.
- Refund and dispute state changes MUST be traceable to provider events and internal actions.
- Duplicate refund requests MUST be idempotent.
- Chargeback and dispute effects MUST be reflected in reconciliation and ledger processes.

## MUST NOT
- MUST NOT issue a refund merely because a prior request timed out without checking provider status.
- MUST NOT exceed the legally or financially refundable amount.
- MUST NOT delete dispute history after resolution.

## SHOULD
- Model refunds and disputes as explicit lifecycle entities rather than flags on unrelated records.

## Exceptions
Require documented policy basis, evidence, financial impact, and approval.

## Verification
Use partial-refund, duplicate, timeout, and dispute-lifecycle tests plus ledger reconciliation.