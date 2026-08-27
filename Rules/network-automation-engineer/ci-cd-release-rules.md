# CI/CD and Release Rules

## Purpose
Make network automation code and policy changes reproducible, reviewable, and progressively deployable.

## Scope
Pull requests, CI validation, artifacts, releases, promotion, deployment pipelines, and rollback of automation versions.

## MUST
- Production automation changes MUST pass required validation and tests from a version-controlled revision.
- Released artifacts MUST be immutable or content-addressed and traceable to source revision and dependencies.
- Promotion across environments MUST preserve the reviewed artifact rather than rebuild untraceably.
- Pipeline changes that weaken safety gates MUST receive explicit review.
- Rollout of materially changed automation logic MUST support bounded canary or staged deployment where blast radius warrants it.

## MUST NOT
- MUST NOT deploy uncommitted local code directly to production automation runners.
- MUST NOT bypass failing tests or validation by disabling them without documented risk acceptance.
- MUST NOT silently upgrade dependencies in production execution environments.

## SHOULD
- Dependency versions SHOULD be pinned or constrained reproducibly.
- Release notes SHOULD identify behavioral and compatibility changes affecting operators.

## Exceptions
Emergency fixes may use expedited CI only when the incident process records scope, tests performed, approver, and follow-up normalization.

## Verification
Inspect source-to-artifact provenance, required checks, dependency locks, promotion records, canary gates, pipeline diffs, and rollback to a known prior automation version.