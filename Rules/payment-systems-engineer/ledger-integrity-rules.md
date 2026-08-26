# Ledger Integrity Rules

## Purpose
Protect financial truth, traceability, and balanced accounting records.

## Scope
Internal ledgers, balance movements, fee records, reserves, clearing accounts, and settlement accounting.

## MUST
- Every financial movement MUST be represented by immutable or append-only ledger entries with stable identifiers.
- Ledger postings MUST preserve double-entry balance where double-entry accounting is used.
- Corrections MUST be recorded as compensating entries rather than silent mutation of historical financial records.
- Posting rules MUST define currency, account, amount sign, effective time, source transaction, and correlation identifiers.
- Ledger writes and business state changes that must remain consistent MUST use an atomic or explicitly recoverable design.

## MUST NOT
- MUST NOT recompute authoritative historical balances solely from mutable operational tables.
- MUST NOT edit settled financial history without an auditable correction mechanism.
- MUST NOT permit unbalanced entries to become authoritative.

## SHOULD
- Ledger schemas SHOULD separate business semantics from provider-specific fields.

## Exceptions
Exceptions require accounting-owner approval and documented reconciliation controls.

## Verification
Run balance proofs, immutable-history tests, correction tests, recovery tests, and reconciliation against provider settlement data.