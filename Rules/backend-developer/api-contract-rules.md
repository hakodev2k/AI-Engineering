# API Contract Rules

## Purpose
Protect public and internal API behavior from accidental incompatibility and ambiguous semantics.

## Scope
HTTP, RPC, event-facing, and service-to-service contracts owned by backend systems.

## MUST
- Public request and response contracts MUST be explicit, versioned when compatibility requires it, and reviewed before release.
- Validation MUST occur at the boundary before business logic executes.
- Error responses MUST be stable, documented, and distinguish client errors from server failures.
- Contract changes MUST include compatibility analysis and migration impact.

## MUST NOT
- MUST NOT silently repurpose existing fields with new semantics.
- MUST NOT remove or rename public fields without an approved breaking-change strategy.
- MUST NOT leak internal stack traces or sensitive implementation details.

## SHOULD
- Contracts SHOULD be schema-defined and testable through automated contract tests.
- Optional fields SHOULD have deterministic default semantics.

## Exceptions
Breaking changes require documented consumers, migration plan, rollout strategy, rollback path, and explicit approval.

## Verification
Review schemas, diffs, contract tests, generated clients, integration tests, and release notes.