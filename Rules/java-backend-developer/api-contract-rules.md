# API Contract Rules

## Purpose
Protect client compatibility and make backend contracts explicit, stable, and verifiable.

## Scope
Applies to HTTP, RPC, and externally consumed service interfaces.

## MUST
- Request inputs MUST be validated before business operations execute.
- Status codes, error schemas, field semantics, nullability, pagination, and idempotency behavior MUST be defined consistently.
- Breaking contract changes MUST use an approved compatibility or versioning strategy.
- Public contracts MUST distinguish transport DTOs from internal persistence models when coupling would create compatibility risk.
- Timeouts and payload limits MUST be defined for externally reachable endpoints where applicable.

## MUST NOT
- MUST NOT expose stack traces, internal class names, credentials, or sensitive implementation details in errors.
- MUST NOT silently change field meaning, identifier semantics, ordering, or default behavior relied on by clients.
- MUST NOT bind public APIs directly to mutable database schemas without deliberate compatibility analysis.

## SHOULD
- Prefer machine-readable contract specifications and consumer-relevant examples.
- Design mutation endpoints for safe retries when business semantics permit.

## Exceptions
Breaking changes require impact analysis, migration/deprecation plan, owner approval, communication, and rollback or containment strategy.

## Verification
Use schema/contract tests, integration tests, compatibility diffing, negative validation tests, client tests, and review of generated API specifications.