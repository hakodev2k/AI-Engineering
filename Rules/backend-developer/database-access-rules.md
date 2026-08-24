# Database Access Rules

## Purpose
Protect correctness, efficiency, and operability of backend database interactions.

## Scope
Queries, commands, ORM usage, connections, transactions, and data-access abstractions.

## MUST
- Queries MUST retrieve only data required for the operation when practical.
- Connection lifetime and pooling behavior MUST be compatible with the runtime and database limits.
- Data-access code MUST handle transient and permanent failures distinctly.
- Database calls on critical paths MUST be observable with latency and failure telemetry.

## MUST NOT
- MUST NOT build SQL through unsafe string concatenation with untrusted input.
- MUST NOT hide expensive N+1 access patterns behind abstractions.
- MUST NOT hold database connections or transactions across unrelated remote calls without explicit design justification.

## SHOULD
- Read paths SHOULD use projection and appropriate no-tracking/read-only modes where supported.
- Query behavior SHOULD be verified against realistic data volumes.

## Exceptions
Intentional broad reads or long-lived database scopes require measured evidence, ownership, and capacity impact analysis.

## Verification
Inspect generated SQL, query traces, execution plans, connection metrics, integration tests, and load tests.