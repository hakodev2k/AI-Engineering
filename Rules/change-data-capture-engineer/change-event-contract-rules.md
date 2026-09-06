# Change Event Contract Rules

## Purpose
Keep CDC events stable, interpretable, and safe for independent consumers.

## Scope
Event envelopes, operation types, keys, before/after images, metadata, and compatibility.

## MUST
- Every event MUST identify source, entity, operation, and an ordering or source-position token where available.
- Primary/entity keys MUST have stable semantics across compatible versions.
- Null, absent, deleted, and unchanged values MUST be distinguishable when the source permits it.
- Contract changes MUST be assessed for downstream compatibility before release.
- Consumers MUST be able to determine the event schema version or equivalent contract identity.

## MUST NOT
- MUST NOT silently reinterpret an existing field.
- MUST NOT remove required metadata without a migration path.
- MUST NOT expose source-only implementation fields as durable contracts without intent.

## SHOULD
- Prefer explicit envelopes over positional payload assumptions.
- Keep transport metadata separate from business data.

## Exceptions
Breaking changes require consumer inventory, migration plan, approval, and verified cutover.

## Verification
Use schema compatibility checks, contract tests, consumer tests, and representative event inspection.