# Testing and Validation

## Purpose
Catch configuration, contract, security, and behavior defects before infrastructure changes reach production.

## Scope
Formatting, validation, linting, static analysis, module tests, integration tests, and policy tests.

## MUST
- Every change MUST pass Terraform validation and repository-required static checks.
- Reusable modules MUST have tests for critical contracts and failure-prone behavior appropriate to their risk.
- Security-critical defaults and policy constraints MUST be tested or deterministically inspected.
- Tests MUST isolate or clean up provisioned infrastructure to avoid hidden cost and interference.

## MUST NOT
- A successful `terraform validate` MUST NOT be represented as proof that infrastructure behavior is correct.
- Flaky integration tests MUST NOT be normalized through unlimited retries.
- Tests MUST NOT depend on uncontrolled production resources unless explicitly designed and approved for read-only verification.

## SHOULD
- Tests SHOULD cover representative provider versions and meaningful edge cases.
- Fast static checks SHOULD run before expensive provisioning tests.

## Exceptions
Where live tests are impractical, require documented substitute evidence such as provider schema checks, policy tests, and reviewed plans.

## Verification
Inspect CI results, test suites, assertions, cleanup behavior, policy output, static-analysis findings, and representative plan/apply test evidence.