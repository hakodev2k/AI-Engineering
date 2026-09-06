# CI/CD Integration Rules

## Purpose
Shift schema validation and compatibility checks before production deployment while keeping release controls auditable.

## Scope
Pull requests, build pipelines, schema generation, registration gates, promotion, and deployment automation.

## MUST
- CI MUST validate changed schemas syntactically and against applicable compatibility policy before merge or release.
- Schema diffs MUST be reviewable alongside application changes that depend on them.
- Production registration automation MUST authenticate with scoped service identity.
- Promotion pipelines MUST identify the exact schema content or immutable artifact being promoted.
- Failed compatibility or policy checks MUST block promotion unless an approved exception is recorded.

## MUST NOT
- MUST NOT grant CI unrestricted global registry administration solely for convenience.
- MUST NOT generate materially different production schemas from unversioned local state.
- MUST NOT silently retry incompatible registrations as if they were transient failures.

## SHOULD
- Generate human-readable schema diffs in pull requests.
- Reuse the same validation logic locally and in CI where practical.

## Exceptions
Emergency bypass requires explicit approval, exact scope, audit record, and subsequent validation.

## Verification
Inspect pipeline definitions, identities, schema artifacts, PR checks, promotion logs, and exception records.