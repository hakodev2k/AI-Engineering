# Testing and Validation Rules

## Purpose
Require deterministic evidence that network changes and reliability mechanisms behave as intended.

## Scope
Pre-production tests, synthetic checks, configuration validation, failure tests, and post-change verification.

## MUST
- Critical changes MUST define testable success and failure criteria before execution.
- Validation MUST cover the intended behavior and plausible regression paths.
- Failure tests MUST be scoped to prevent uncontrolled production impact.
- Test evidence MUST identify the configuration or version under test.
- Flaky validation MUST be investigated rather than treated as reliable evidence.

## MUST NOT
- MUST NOT use a single successful connectivity check as sufficient validation for complex changes.
- MUST NOT claim resilience without testing relevant failure behavior.
- MUST NOT run destructive tests in production without explicit approval and bounded blast radius.

## SHOULD
- Prefer automated, repeatable validation.
- Include representative client vantage points and service dependencies.

## Exceptions
When pre-production equivalence is impossible, document the limitation, alternative evidence, monitoring, and approval.

## Verification
Review test definitions, CI output, synthetic results, failure-test records, and post-change checks.