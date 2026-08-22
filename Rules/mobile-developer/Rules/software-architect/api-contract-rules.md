# API Contract Rules

## Purpose
Protect compatibility and clarity across software boundaries.

## Scope
Applies to public APIs, internal service contracts, RPC interfaces, schemas, and shared integration contracts.

## MUST
- Contracts MUST define semantics, validation, error behavior, and compatibility expectations.
- Breaking changes MUST use an approved versioning or migration strategy.
- Consumers MUST NOT depend on undocumented implementation details.
- Contract changes MUST identify affected consumers and rollout sequencing.

## MUST NOT
- MUST NOT silently repurpose existing fields or status meanings.
- MUST NOT make breaking public contract changes without explicit approval and migration planning.
- MUST NOT leak internal domain or persistence representations when a stable contract is required.

## SHOULD
- Prefer additive compatible evolution over coordinated breaking changes.
- Prefer machine-verifiable schemas and contract tests.

## Exceptions
Breaking changes require documented rationale, consumer impact, migration path, rollback plan, and human approval.

## Verification
Use schema diffing, contract tests, consumer tests, API review, and release validation.