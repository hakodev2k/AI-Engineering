# Contract Testing Rules

## Purpose
Detect producer and consumer incompatibilities before release.

## Scope
Applies to schema validation, semantic assertions, compatibility checks, representative fixtures, and consumer expectations.

## MUST
- Contract changes MUST execute automated compatibility checks before merge when deterministic validation is possible.
- Critical semantics that cannot be expressed in schema MUST have executable assertions or equivalent review evidence.
- Tests MUST cover required fields, nullability, types, enumerations, boundary values, and documented invariants relevant to the contract.
- Contract test failures MUST block release unless an approved exception exists.

## MUST NOT
- Tests MUST NOT validate only happy-path examples for contracts with meaningful edge conditions.
- Mock data MUST NOT contradict production contract semantics merely to simplify tests.
- Flaky contract tests MUST NOT be ignored indefinitely.

## SHOULD
- Producer and consumer test suites SHOULD share canonical fixtures or generated examples where practical.
- Tests SHOULD include historical compatibility cases for high-value contracts.

## Exceptions
Exceptions require reason, affected guarantees, alternative evidence, remediation date, and approval.

## Verification
Inspect CI results, contract-test definitions, fixtures, schema validators, failure history, and exception records.