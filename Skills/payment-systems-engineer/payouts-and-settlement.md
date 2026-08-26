# Payouts and Settlement

## Purpose
Design outbound money movement and settlement workflows with strong controls for correctness, eligibility, batching, and recovery.

## When to use
Use for merchant/vendor payouts, bank transfers, settlement batches, reserves, or scheduled disbursements.

## Inputs
Beneficiary data, payable balances, schedules, provider/bank constraints, fees, reserves, compliance status.

## Context to inspect
Ledger, payout state machine, beneficiary verification, batch jobs, provider adapters, reconciliation, operational approvals.

## Core knowledge
Available balance is not necessarily payable balance. Payouts are high-impact irreversible workflows requiring durable instruction identity, eligibility checks, cutoff handling, and reconciliation. Settlement timing differs from payment authorization/capture timing.

## Procedure
1. Define payable-balance calculation and reserve rules.
2. Verify beneficiary eligibility and destination status.
3. Define schedule, cutoff, holidays, and currency rules.
4. Create immutable payout instruction IDs.
5. Reserve funds before submission.
6. Enforce idempotency and concurrency controls.
7. Submit through provider adapter with bounded recovery semantics.
8. Track pending, submitted, paid, failed, returned, and unknown outcomes.
9. Release or repost reserves only through explicit transitions.
10. Reconcile provider and bank settlement evidence.
11. Support controlled operator remediation with audit trail.
12. Monitor payout aging, failure rate, return rate, and unmatched value.

## Decision points
Batch versus real-time payout depends on rail capability, cost, urgency, risk, and reconciliation complexity.

## Common failure patterns
Paying from stale balances, duplicate batch submission, retrying unknown outcomes blindly, ignoring bank holidays, and mutating completed payout history.

## Verification
Test duplicate execution, concurrent balance changes, provider timeout, return flows, cutoff boundaries, and ledger reconciliation.

## Expected output
A controlled payout lifecycle with eligibility, reservation, idempotency, accounting, reconciliation, and operational recovery.

## Stop conditions
Escalate uncertain beneficiary compliance, insufficient funds, material reconciliation breaks, or destructive manual corrections.