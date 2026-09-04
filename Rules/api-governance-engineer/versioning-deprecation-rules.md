# Versioning and Deprecation Rules

## Purpose
Make incompatible API evolution explicit, controlled, and survivable for consumers.

## Scope
Applies to versioned APIs, deprecation notices, sunset plans, and breaking changes.

## MUST
- Breaking changes MUST use an approved versioning or migration mechanism.
- Deprecation MUST identify affected contract elements, replacement path, support window, migration guidance, and sunset criteria.
- Consumer usage evidence MUST be reviewed before retiring a supported contract.
- Sunset execution MUST require explicit approval and a rollback or restoration plan when technically possible.
- Version identifiers MUST have stable documented semantics.

## MUST NOT
- Breaking changes MUST NOT be hidden behind documentation-only updates.
- Deprecated functionality MUST NOT be removed solely because a calendar date passed when active consumers remain unassessed.
- Multiple versions MUST NOT diverge semantically without documenting the difference.

## SHOULD
- Deprecation windows SHOULD reflect consumer criticality and migration complexity.
- Long-lived versions SHOULD receive security and reliability maintenance consistent with stated support policy.

## Exceptions
Emergency changes require documented risk, consumer communication, approval, and post-change review.

## Verification
Inspect version diffs, deprecation metadata, consumer telemetry, migration communications, approvals, and release tests. Verify sunset criteria are met before removal.