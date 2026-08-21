# Database Validation Rules

## Purpose
Use database evidence safely when validating persisted outcomes and data integrity.

## Scope
Applies to automated verification involving relational, document, key-value, or other persistent stores.

## MUST
- Database assertions MUST verify business-relevant persisted state only when that layer is intentionally part of the test boundary.
- Test queries MUST be scoped to uniquely owned or identified data.
- Cleanup and mutation operations MUST use safe predicates and environment controls.
- Concurrency and eventual persistence behavior MUST be considered when relevant.

## MUST NOT
- MUST NOT couple black-box tests to private schema details without explicit integration-test intent.
- MUST NOT execute destructive broad SQL or equivalent operations without approved safeguards.
- MUST NOT use production databases for automation mutation unless explicitly authorized and designed for it.

## SHOULD
- Prefer public API verification when persistence internals are not the requirement.
- Use transaction or isolated database strategies where they improve repeatability.

## Exceptions
Direct database setup/verification is acceptable for integration efficiency when boundary and coupling are documented.

## Verification
Review query predicates, data ownership, permissions, cleanup, schema coupling, and concurrency behavior.