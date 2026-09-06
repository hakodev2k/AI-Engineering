# Configuration and Versioning Rules

## Purpose
Keep routing configuration reproducible, reviewable, compatible, and recoverable.

## Scope
Route definitions, model registries, provider settings, thresholds, feature flags, and environment-specific values.

## MUST
- Production routing configuration MUST be version controlled or backed by an equivalent immutable audit history.
- Every decision-affecting configuration revision MUST be identifiable in production telemetry.
- Schema changes to routing configuration MUST define compatibility and migration behavior.
- Environment-specific values MUST be separated from reusable policy semantics.
- Configuration validation MUST run before activation and reject unknown or unsafe combinations.

## MUST NOT
- MUST NOT make untracked production edits that cannot be reconstructed.
- MUST NOT store credentials or secrets in routing configuration.
- MUST NOT reinterpret an existing configuration field with materially different semantics without versioning or migration.

## SHOULD
- Prefer declarative configuration with deterministic validation.
- Retain known-good revisions for rapid rollback.

## Exceptions
Emergency edits require audit evidence, incident context, owner, and subsequent reconciliation into the governed configuration source.

## Verification
Inspect configuration history, validation tests, schema migrations, telemetry version tags, secret scans, and rollback exercises.