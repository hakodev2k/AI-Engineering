# Disputes and Chargebacks

## Purpose
Model and operate dispute lifecycles so evidence, deadlines, accounting effects, and customer state remain consistent.

## When to use
Use when integrating dispute notifications, evidence submission, chargeback accounting, or operational tooling.

## Inputs
Provider/network dispute states, deadlines, reason codes, evidence requirements, ledger policy, business rules.

## Context to inspect
Webhook events, transaction records, customer/order data, document storage, ledger entries, operator workflows.

## Core knowledge
Disputes are asynchronous, deadline-driven workflows separate from ordinary refunds. Financial impact can include provisional debits, reversals, fees, wins, and losses. Evidence handling can contain sensitive personal data.

## Procedure
1. Map provider states into stable internal dispute states.
2. Persist provider dispute ID, amount, currency, reason, and deadlines.
3. Link to original payment without mutating history.
4. Define ledger postings for each financial stage.
5. Build evidence requirements by reason category.
6. Enforce secure access and retention for evidence.
7. Generate operator alerts before deadlines.
8. Make event handling idempotent and order-tolerant.
9. Submit evidence with confirmation tracking.
10. Reconcile final provider outcome and accounting.
11. Feed confirmed outcomes into fraud/risk analysis where lawful.
12. Measure dispute rate, value, win rate, and aging.

## Decision points
Automate evidence only when source data is trustworthy and submission rules are deterministic; otherwise require human review.

## Common failure patterns
Treating chargebacks as refunds, missing deadlines, duplicate ledger impact, exposing evidence broadly, and trusting event order.

## Verification
Replay dispute events, test deadline alerts, validate accounting postings, confirm evidence access controls, and reconcile final outcomes.

## Expected output
An auditable dispute workflow with correct financial treatment, evidence handling, deadlines, and metrics.

## Stop conditions
Escalate unclear legal/privacy requirements, material accounting ambiguity, or unsupported provider evidence rules.