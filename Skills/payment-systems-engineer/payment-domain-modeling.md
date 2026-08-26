# Payment Domain Modeling

## Purpose
Model payment lifecycles so money movement, state transitions, ownership, and failure recovery remain explicit and auditable.

## When to use
Use when designing or changing payment, authorization, capture, refund, reversal, payout, or settlement flows.

## Inputs
Business requirements, provider contracts, existing schemas, state diagrams, ledger rules, compliance constraints.

## Preconditions
Identify currencies, actors, payment rails, source of truth, and irreversible operations. Do not infer provider behavior without evidence.

## Context to inspect
Existing payment entities, identifiers, status enums, callbacks, reconciliation jobs, ledger entries, retry logic, and operational tooling.

## Core knowledge
A payment intent, provider attempt, money movement, and accounting entry are different concepts. Model business state separately from transport/provider state. State machines need legal transitions, terminal states, compensations, timestamps, and immutable identifiers.

## Procedure
1. Identify actors and ownership boundaries.
2. Enumerate business operations and monetary invariants.
3. Separate intent, attempt, transaction, and ledger concepts.
4. Define legal state transitions and triggering evidence.
5. Mark irreversible and externally controlled transitions.
6. Define identifiers and correlation keys.
7. Specify duplicate-event behavior and idempotency.
8. Model partial captures/refunds when supported.
9. Define timeout and unknown-result states.
10. Define reconciliation paths for ambiguous outcomes.
11. Add audit metadata without storing prohibited sensitive data.
12. Validate the model against success, decline, timeout, duplicate, and recovery scenarios.

## Decision points
Prefer explicit state machines when transitions affect money or recovery. Avoid collapsing provider-specific statuses into the domain unless they have stable business meaning.

## Common failure patterns
Boolean paid flags, conflating attempts with payments, mutable transaction IDs, missing unknown states, assuming timeout means failure, and permitting illegal transitions.

## Verification
Walk every supported scenario through the state model; assert invariants with tests; verify duplicate and out-of-order events; confirm reconciliation can resolve ambiguous states.

## Expected output
A domain model, transition rules, invariants, identifiers, and recovery semantics suitable for implementation and operations.

## Stop conditions
Escalate when legal/compliance ownership, accounting semantics, or provider guarantees are unresolved.