# Event Contract Rules

## Purpose
Protect compatibility and meaning of event streams across independently deployed producers and consumers.

## Scope
Applies to event names, keys, headers, payload schemas, semantic meaning, ownership, and published compatibility guarantees.

## MUST
- Every published event MUST have an explicit owner, purpose, schema, key semantics, and compatibility policy.
- Event names and fields MUST describe business facts rather than producer implementation details.
- Required/optional fields, nullability, units, timestamps, identifiers, and enum evolution MUST be defined unambiguously.
- Contract changes MUST be evaluated against deployed consumers before release.
- Producers MUST preserve the documented meaning of existing fields across compatible versions.
- Consumer assumptions that exceed the published contract MUST be treated as consumer-owned risk.

## MUST NOT
- MUST NOT repurpose an existing field or event name with different semantics.
- MUST NOT remove or narrow a published field without an approved breaking-change strategy.
- MUST NOT expose secrets or unnecessary sensitive data in events.
- MUST NOT infer compatibility solely because serialization succeeds.

## SHOULD
- Contracts SHOULD be machine-readable and stored under version control.
- Events SHOULD carry stable identifiers and occurrence timestamps when required for deduplication, ordering, or audit.
- Schemas SHOULD minimize accidental coupling to internal storage models.

## Exceptions
Any intentional incompatibility requires documented consumers, migration sequencing, rollback implications, evidence that affected owners were notified, and explicit approval.

## Verification
Use schema compatibility checks in CI, contract tests, representative consumer tests, repository diff review, and production telemetry for deserialization or semantic failures.