# Ledger Consistency Rules

## Purpose
Protect financial truth by keeping ledger records complete, balanced, and append-safe.

## Scope
Internal ledgers, balance mutations, journal entries, posting, and financial state derived from payment events.

## MUST
- Financial state changes MUST be represented by durable ledger entries or an equivalent auditable source of truth.
- Ledger writes MUST preserve defined invariants, including balanced postings where double-entry accounting is used.
- Corrections MUST be represented as compensating entries rather than destructive history edits.
- Each ledger entry MUST be traceable to the originating business operation and external transaction when applicable.

## MUST NOT
- MUST NOT silently delete or rewrite posted financial history.
- MUST NOT derive authoritative balances solely from eventually consistent caches.
- MUST NOT mark a transaction complete if required ledger posting failed.

## SHOULD
- Make ledger posting idempotent and deterministic.

## Exceptions
Exceptions require finance-domain review, documented invariants, evidence, and approval.

## Verification
Run invariant checks, reconciliation tests, audit-trail review, and database consistency queries.