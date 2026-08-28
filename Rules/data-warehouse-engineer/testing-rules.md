# Warehouse Testing Rules

## Purpose
Provide deterministic evidence that warehouse logic, contracts, and historical behavior remain correct.

## Scope
Applies to transformation, schema, integration, reconciliation, regression, and end-to-end tests.

## MUST
- Critical transformations MUST have tests for grain, keys, nullability, relationships, and business-critical calculations.
- Tests MUST include realistic failure and boundary cases, not only happy paths.
- Schema and contract changes MUST run regression checks against representative downstream consumers.
- Test data MUST be deterministic and must not expose production secrets or sensitive records unnecessarily.

## MUST NOT
- MUST NOT rely solely on successful job completion as proof of data correctness.
- MUST NOT ignore flaky tests without a documented root-cause investigation.

## SHOULD
- Prefer layered tests so defects can be localized quickly.
- High-risk historical logic SHOULD include replay or backfill tests.

## Exceptions
Reduced coverage requires documented risk, scope, alternative evidence, and reviewer approval.

## Verification
Inspect CI results, test definitions, failure fixtures, coverage of critical paths, and sampled reconciliation outputs.