# Reconciliation Rules

## Purpose
Detect and resolve divergence between internal financial records and external provider truth.

## Scope
Payments, captures, refunds, disputes, payouts, settlements, fees, and balance movements.

## MUST
- Reconciliation MUST compare authoritative internal records with provider or bank records on a defined cadence.
- Mismatches MUST be classified, tracked, and assigned an owner until resolved.
- Reconciliation logic MUST be idempotent and safe to rerun.
- Ambiguous transaction outcomes MUST enter reconciliation before a compensating financial action is issued.
- Material reconciliation gaps MUST trigger alerting or escalation.

## MUST NOT
- MUST NOT silently discard unmatched records.
- MUST NOT auto-correct financially material discrepancies without an approved policy.
- MUST NOT treat absence from one report as proof that a transaction never occurred without provider-specific evidence.

## SHOULD
- Preserve raw source references and matching rationale for auditability.

## Exceptions
Require documented source limitations, residual risk, and approval.

## Verification
Run synthetic mismatch cases, inspect unresolved queues, compare sample provider reports, and verify audit trails.