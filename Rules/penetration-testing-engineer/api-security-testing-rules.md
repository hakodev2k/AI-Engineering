# API Security Testing Rules

## Purpose
Assess API security using contract-aware, identity-aware, and state-aware testing.

## Scope
Applies to REST, RPC, GraphQL, event-facing APIs, machine-to-machine interfaces, and externally callable service contracts.

## MUST
- MUST identify authentication modes, authorization boundaries, object identifiers, rate controls, versioning, and sensitive operations.
- MUST test object-level and function-level authorization with controlled principals of different privilege levels.
- MUST validate server-side schema, type, boundary, pagination, filtering, and mass-assignment behavior where relevant.
- MUST evaluate replay, idempotency, token scope, and state-transition risks for sensitive operations.
- MUST correlate findings with exact requests, responses, identities, and preconditions.

## MUST NOT
- MUST NOT infer authorization correctness from UI behavior.
- MUST NOT use uncontrolled enumeration against production datasets.
- MUST NOT replay state-changing requests when duplicate execution could create material impact without approval.
- MUST NOT expose live tokens or credentials in reports.

## SHOULD
- SHOULD derive test cases from API specifications and observed behavior, then investigate discrepancies.
- SHOULD test negative authorization paths before broad fuzzing.

## Exceptions
High-volume enumeration, destructive mutations, or replay of financially or operationally sensitive calls requires explicit authorization and safeguards.

## Verification
Inspect API specifications, identity matrix, raw traffic, test data, rate configuration, logs, and reproduction steps. Confirm each security conclusion is tied to server-enforced behavior.