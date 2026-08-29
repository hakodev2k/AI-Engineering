# Integration Contract Rules

## Purpose
Keep graph-backed integrations stable, explicit, and resilient to schema evolution.

## Scope
Application repositories, APIs, ETL connectors, CDC, event consumers, exports, and external graph clients.

## MUST
- Define stable external contracts independently from incidental internal graph representation.
- Validate inputs before translating them into graph mutations or traversals.
- Define timeout, retry, idempotency, and partial-failure behavior for integrations.
- Assess downstream compatibility before renaming or removing labels, relationship types, properties, or exported fields.
- Version breaking contracts or provide a migration window.

## MUST NOT
- Expose unrestricted query execution to untrusted callers.
- Leak internal graph identifiers as durable external identity unless explicitly designed as stable identifiers.
- Retry non-idempotent mutations without deduplication controls.

## SHOULD
- Encapsulate graph-specific query details behind tested data-access boundaries.
- Use contract tests for critical consumers.

## Exceptions
Direct graph access by trusted analytical users requires scoped privileges, resource controls, documented support boundaries, and auditability.

## Verification
Review API/schema diffs, contract tests, authorization, timeout/retry configuration, consumer compatibility evidence, and representative failure tests.