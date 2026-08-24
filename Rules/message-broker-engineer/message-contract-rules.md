# Message Contract

## Purpose
Protect interoperability and independent deployment.

## Scope
Schemas, envelopes, metadata, serialization, and compatibility.

## MUST
- Published messages MUST have an explicit, version-controlled contract.
- Required fields, nullability, identifiers, timestamps, units, and semantic meaning MUST be defined.
- Contract changes MUST be checked against supported consumers before release.

## MUST NOT
- MUST NOT repurpose an existing field with incompatible semantics.
- MUST NOT expose internal object graphs as accidental public contracts.

## SHOULD
- Prefer additive evolution and tolerant readers where appropriate.

## Exceptions
Breaking changes require migration plan, consumer coordination, rollback path, and approval.

## Verification
Run schema compatibility checks, consumer contract tests, serialization tests, and review diffs.