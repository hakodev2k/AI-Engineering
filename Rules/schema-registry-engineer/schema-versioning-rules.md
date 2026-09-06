# Schema Versioning Rules

## Purpose
Keep schema history traceable and make evolution decisions explicit.

## Scope
Version identifiers, registration order, immutable history, aliases, and release mapping.

## MUST
- Registered production schema versions MUST be immutable.
- Every deployed producer version MUST map unambiguously to a registered schema version.
- Version history MUST remain available for the required support and audit period.
- Re-registration of semantically different schemas MUST create a new version.
- Rollback procedures MUST identify the schema versions compatible with the rollback target.

## MUST NOT
- MUST NOT rewrite historical schema versions to make an incompatible change appear compatible.
- MUST NOT use application release numbers as a substitute for registry version identity unless equivalence is enforced.
- MUST NOT delete versions still referenced by retained data or supported consumers.

## SHOULD
- Maintain release-to-schema traceability automatically.
- Keep version progression monotonic within each subject.

## Exceptions
Version cleanup requires evidence that retained data, supported consumers, audits, and rollback no longer require the version.

## Verification
Inspect registry history, deployment manifests, retained-data references, and rollback tests.