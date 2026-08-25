# Save Data Rules

## Purpose
Protect player progress and preserve compatibility across releases.

## Scope
Local/cloud saves, checkpoints, serialization, migration, corruption recovery, and conflict resolution.

## MUST
- Persisted formats MUST be versioned when future schema evolution is possible.
- Save writes MUST be atomic or recoverable from interruption.
- Schema changes MUST include migration or explicit compatibility handling.
- Corrupt, partial, and incompatible saves MUST fail safely with actionable diagnostics.
- Cloud conflicts MUST use a defined resolution policy that minimizes progress loss.

## MUST NOT
- MUST NOT silently discard player progress because deserialization fails.
- MUST NOT serialize volatile runtime implementation details as the only durable contract.

## SHOULD
- Critical saves SHOULD retain a recoverable previous generation.
- Migration SHOULD be tested from supported historical versions.

## Exceptions
Ephemeral session-only data may omit durable compatibility requirements when loss is an accepted product property.

## Verification
Run migration fixtures, interrupted-write tests, corruption tests, cloud-conflict tests, and cross-version compatibility suites.