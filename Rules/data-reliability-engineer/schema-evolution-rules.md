# Schema Evolution Rules

## Purpose
Evolve schemas without introducing uncontrolled downstream failures.

## Scope
Source, transport, warehouse, lakehouse, event, and analytical schemas.

## MUST
- Classify every schema change as backward-compatible, conditionally compatible, or breaking before deployment.
- Identify affected producers, consumers, transformations, and stored historical data.
- Provide migration sequencing for breaking or semantic changes.
- Test compatibility using representative historical and current records.

## MUST NOT
- Rename, remove, narrow, or reinterpret fields without consumer impact analysis.
- Assume nullable additions are harmless when downstream logic may enumerate fields or enforce strict schemas.
- Couple schema rollout to an irreversible cutover without rollback or coexistence planning.

## SHOULD
- Prefer additive evolution and deprecation windows.
- Automate schema-diff checks in CI.

## Exceptions
Emergency changes require documented impact, explicit approval, and post-change reconciliation.

## Verification
Inspect schema diffs, contract tests, dependency maps, migration plans, and post-deployment consumer health.