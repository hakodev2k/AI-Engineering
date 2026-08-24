# MLOps Testing Rules

## Purpose
Protect ML delivery against regressions in code, data assumptions, pipelines, artifacts, and production integration.

## Scope
Covers unit, integration, contract, pipeline, model, infrastructure, and end-to-end tests.

## MUST
- Critical transformations and pipeline control logic MUST have deterministic automated tests.
- Data and feature contracts MUST be tested at boundaries where incompatible changes can corrupt training or inference.
- Release candidates MUST pass integration tests covering artifact loading, preprocessing, inference, and expected output contract.
- Failure paths such as missing data, dependency timeout, corrupted artifact, and resource exhaustion MUST be tested where material.
- Regression tests MUST be added for consequential production defects when practical.

## MUST NOT
- Flaky tests MUST NOT be normalized through unlimited retries or ignored failures.
- Unit tests MUST NOT substitute for end-to-end validation of production-critical integration boundaries.

## SHOULD
- Tests SHOULD use representative but minimized datasets and avoid unnecessary sensitive data.
- Infrastructure and deployment policies SHOULD be testable before production application.

## Exceptions
A skipped critical test requires documented reason, compensating evidence, risk, owner approval, and remediation tracking.

## Verification
Review CI results, test determinism, contract fixtures, failure-injection coverage, regression cases, integration environments, and skipped-test records.