# Testing and Validation Rules

## Purpose
Prevent registry regressions that could corrupt artifacts, metadata, lifecycle state, or deployment integration.

## Scope
Unit, integration, contract, migration, permission, failure, and end-to-end tests.

## MUST
- Critical registry workflows MUST have automated coverage for register, retrieve, promote, resolve, archive, and rollback behavior.
- Artifact integrity and metadata-schema validation MUST be tested.
- Permission tests MUST prove both allowed and denied lifecycle actions.
- Storage or schema migrations MUST include compatibility and recovery tests.
- Failures during upload or state transition MUST leave the registry in a consistent state.

## MUST NOT
- MUST NOT rely solely on happy-path unit tests for production registry behavior.
- MUST NOT ignore flaky lifecycle or permission tests without ownership and remediation.
- MUST NOT promote a migration that cannot preserve required historical records.

## SHOULD
- Include end-to-end tests from training registration through deployment resolution.
- Use immutable test fixtures for artifact verification.

## Exceptions
Manual validation requires documented evidence, reviewer, and reason automation is impractical.

## Verification
Inspect CI results, integration suites, permission tests, migration tests, and failure-injection coverage.