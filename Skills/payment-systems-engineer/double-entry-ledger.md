# Double-Entry Ledger

## Purpose
Design auditable accounting records where every monetary movement preserves balance and historical truth.

## When to use
Use when a system owns balances, fees, reserves, credits, liabilities, or internal money movement.

## Inputs
Accounting events, account taxonomy, currencies, posting rules, settlement model, audit requirements.

## Preconditions
Obtain finance/accounting agreement on economic meaning. A ledger is not a substitute for product payment state.

## Context to inspect
Balance tables, transaction history, adjustments, settlement reports, database constraints, reconciliation processes.

## Core knowledge
Every journal transaction contains balanced debits and credits. Posted entries should be immutable; corrections are compensating entries. Ledger time and effective business time may differ. Currency boundaries must be explicit.

## Procedure
1. Define account types and ownership.
2. Define posting rules for each economic event.
3. Represent amounts exactly and bind them to currency.
4. Create immutable journal transaction IDs.
5. Require balanced postings atomically.
6. Separate pending/reserved from posted balances when needed.
7. Define reversal and adjustment semantics.
8. Prevent cross-currency balancing without explicit FX legs.
9. Add references to originating business operations.
10. Compute or maintain balances with consistency guarantees.
11. Build reconciliation queries and audit views.
12. Test conservation invariants under concurrency and replay.

## Decision points
Derived balances maximize audit simplicity; materialized balances improve read performance but require transactional correctness and rebuild capability.

## Common failure patterns
Updating historical entries, deleting mistakes, mixing currencies, storing only current balance, unbalanced fee postings, and using floating point.

## Verification
Assert every journal balances, reconstruct account balances from entries, test reversals, concurrency, duplicate commands, and reconciliation against external statements.

## Expected output
An immutable balanced ledger model with posting rules, correction semantics, and reproducible balances.

## Stop conditions
Escalate unresolved accounting treatment, legal ownership, or currency-conversion semantics.