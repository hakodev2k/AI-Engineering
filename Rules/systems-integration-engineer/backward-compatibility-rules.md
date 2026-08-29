# Backward Compatibility Rules

## Purpose
Prevent integration changes from breaking existing producers, consumers, data contracts, or operational dependencies.

## Scope
Applies to APIs, events, files, schemas, routing behavior, and transformation changes.

## MUST
- Every externally consumed contract change MUST be evaluated for backward compatibility before release.
- Additive changes MUST still consider clients that reject unknown fields or enum values.
- Deprecation MUST define affected consumers, migration guidance, support window, and removal criteria.
- Breaking changes MUST use a coordinated versioning or migration strategy and require explicit approval.
- Compatibility assumptions MUST be supported by tests or consumer evidence where practical.

## MUST NOT
- MUST NOT rename, remove, reinterpret, or change the datatype of a published field silently.
- MUST NOT reuse retired enum values or identifiers for different meanings.
- MUST NOT assume all consumers upgrade simultaneously.

## SHOULD
- Tolerant-reader and additive evolution patterns SHOULD be used when they preserve semantic correctness.
- Compatibility tests SHOULD run in CI for critical contracts.

## Exceptions
Document affected consumers, business necessity, migration sequence, fallback, risk, and approval.

## Verification
Use contract diffs, schema compatibility checks, consumer tests, migration plans, release notes, and representative old-client validation.