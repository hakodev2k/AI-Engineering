# Transaction Boundary Rules

## Purpose
Prevent partial financial state when local database work and external payment actions cross system boundaries.

## Scope
Database transactions, outbox/inbox patterns, provider calls, ledger posting, and asynchronous payment workflows.

## MUST
- Atomic local state changes MUST execute within explicit transaction boundaries.
- Workflows spanning local storage and external providers MUST define consistency and compensation behavior.
- Durable intent MUST be recorded before asynchronous side effects when recovery depends on replay.
- Transaction state transitions MUST be monotonic or explicitly compensating.

## MUST NOT
- MUST NOT hold database transactions open across slow external network calls unless a documented design requires it.
- MUST NOT assume a distributed transaction exists when the provider does not participate in one.
- MUST NOT acknowledge success before required durable state is committed.

## SHOULD
- Prefer outbox/inbox or equivalent durable messaging patterns for cross-boundary coordination.

## Exceptions
Require documented failure scenarios, recovery strategy, evidence, and approval.

## Verification
Use failure-injection tests around every transaction boundary and inspect state after crashes, retries, and provider timeouts.