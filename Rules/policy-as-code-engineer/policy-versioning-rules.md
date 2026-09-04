# Policy Versioning Rules

## Purpose
Ensure policy changes are traceable, compatible, reproducible, and safely consumable across environments and enforcement points.

## Scope
Applies to policy source revisions, bundles, schemas, decision contracts, policy data formats, deployment promotion, and rollback targets.

## MUST
- Every deployed policy set MUST have an immutable version identifier tied to its source revision and build inputs.
- Breaking changes to decision contracts, required inputs, or policy data schemas MUST use an explicit migration or versioning strategy.
- Rollback targets MUST remain identifiable and retrievable for the supported recovery window.
- Promotion across environments MUST preserve provenance of the evaluated policy artifact.
- Version compatibility between evaluator runtime, policy bundle, and data schema MUST be validated before activation.

## MUST NOT
- Mutable labels such as `latest` MUST NOT be the only identifier recorded for production decisions.
- A policy artifact MUST NOT be rebuilt differently under the same immutable version.
- Old policy versions MUST NOT be removed while active consumers or rollback procedures still depend on them.

## SHOULD
- Policy artifacts SHOULD be content-addressed where practical.
- Deprecations SHOULD provide explicit migration windows and consumer inventory.

## Exceptions
Require documented compatibility rationale, affected consumers, risk, rollback evidence, and approval where production decisions can change.

## Verification
Inspect bundle metadata, source-to-artifact provenance, compatibility tests, promotion records, rollback exercises, and decision logs. Confirm a historical decision can be associated with the exact policy version that evaluated it.