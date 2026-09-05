# Settlement and Payout Rules

## Purpose
Ensure settlement and payout workflows remain complete, traceable, and safe under delays or partial failure.

## Scope
Merchant settlement, platform payouts, bank transfers, payout batches, reserves, and settlement reports.

## MUST
- Settlement and payout instructions MUST use stable identities and be safe against duplicate execution.
- Expected settlement amounts MUST be derived from authoritative transactions, fees, adjustments, and reserves.
- Payout status MUST be reconciled with provider or bank records until terminal.
- Failed or returned payouts MUST preserve their original lineage and financial impact.
- Batch boundaries and cut-off times MUST be explicit and timezone-safe.

## MUST NOT
- MUST NOT mark a payout successful solely because submission was accepted.
- MUST NOT regenerate payout identities on retry.
- MUST NOT silently omit failed items from batch totals.

## SHOULD
- Separate payout preparation, approval, submission, and reconciliation responsibilities.

## Exceptions
Require documented operational reason, financial risk, evidence, and approval.

## Verification
Use batch-total checks, duplicate-submission tests, provider reconciliation, and returned-payout scenarios.