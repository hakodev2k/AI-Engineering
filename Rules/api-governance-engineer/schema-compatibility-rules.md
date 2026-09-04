# Schema Compatibility Rules

## Purpose
Prevent accidental consumer breakage as API schemas evolve.

## Scope
Applies to request, response, event, enum, and shared schema changes.

## MUST
- Every schema change MUST be classified as backward-compatible, conditionally compatible, or breaking before merge.
- Compatibility evaluation MUST consider generated clients, strict validators, stored payloads, and downstream consumers where relevant.
- Adding required request fields MUST be treated as breaking unless a proven compatibility mechanism exists.
- Removing or changing the meaning, type, format, or allowed range of existing fields MUST be treated as breaking.
- Enum evolution MUST account for consumers that do not tolerate unknown values.

## MUST NOT
- A change MUST NOT be declared compatible based only on server compilation or unit tests.
- Existing field semantics MUST NOT be reinterpreted silently.
- Schema validators MUST NOT be weakened solely to hide an incompatible contract change.

## SHOULD
- Compatibility checks SHOULD run automatically against the previous released contract.
- Additive fields SHOULD be optional unless domain invariants require otherwise and migration is coordinated.

## Exceptions
Exceptions require a consumer impact assessment, migration plan, rollout controls, rollback plan, and approval.

## Verification
Run schema-diff tooling, contract tests, generated-client builds, compatibility CI checks, and targeted consumer validation for high-risk changes.