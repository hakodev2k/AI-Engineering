# Transaction Boundary Rules

## Purpose
Prevent inconsistent state when database work and message publication or consumption interact.

## Scope
Transactional producers, outbox/inbox patterns, broker transactions, database transactions, and external side effects.

## MUST
- Every flow that changes durable state and sends or consumes messages MUST define its atomicity boundary.
- When one atomic transaction cannot cover all systems, failure windows MUST be explicitly handled with outbox, inbox, compensation, or reconciliation.
- Transactional guarantees MUST include the exact resources and failure modes they cover.
- Recovery after partial completion MUST be testable.

## MUST NOT
- MUST NOT describe multi-system operations as atomic when no mechanism enforces that property.
- MUST NOT publish before a required database commit when doing so can expose uncommitted business state.

## SHOULD
- Prefer durable outbox/inbox patterns over distributed transactions when they reduce operational coupling.

## Exceptions
Alternative consistency designs require documented trade-offs, failure analysis, and approval.

## Verification
Inspect transaction scopes, crash tests, reconciliation logic, outbox/inbox state, and duplicate handling.