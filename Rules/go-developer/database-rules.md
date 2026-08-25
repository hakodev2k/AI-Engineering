# Database Rules

## Purpose
Make Go database access correct, bounded, and operationally safe.

## Scope
`database/sql`, drivers, queries, transactions, connection pools, and persistence adapters.

## MUST
- Queries MUST use parameter binding for untrusted values.
- Rows, statements, and transactions MUST be closed or completed correctly.
- Query contexts MUST propagate deadlines and cancellation.
- Connection pool settings MUST reflect database capacity and workload evidence.
- Transaction boundaries MUST preserve required business invariants.

## MUST NOT
- MUST NOT build SQL by concatenating untrusted input.
- MUST NOT leave transactions open across uncontrolled remote calls without explicit design.
- MUST NOT claim query optimization without runtime or execution-plan evidence.

## SHOULD
- Retrieve only required columns for hot read paths.
- Distinguish not-found, conflict, timeout, and infrastructure failures where callers need different behavior.

## Exceptions
Raw/dynamic SQL requires constrained inputs, review, and injection tests.

## Verification
Integration tests against the target database, query plans, pool metrics, timeout tests, and transaction-failure tests.