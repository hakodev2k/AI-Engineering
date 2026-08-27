# Testing and Regression Rules
## Purpose
Detect implementation defects and unintended behavioral changes early.
## Scope
Unit, property, integration, system, numerical, and regression testing.
## MUST
- Test critical equations, invariants, boundary cases, failure paths, and integration contracts.
- Maintain trusted reference cases for decision-relevant outputs.
- Define tolerances based on numerical behavior rather than arbitrary convenience.
## MUST NOT
- update golden/reference outputs merely to make failing tests pass without reviewing the cause.
- rely only on end-to-end tests for numerical correctness.
## SHOULD
- Use property-based tests for conservation laws and invariants.
## Exceptions
Intentional baseline changes require evidence, impact review, and approval.
## Verification
CI results, coverage of critical paths, baseline diffs, invariant tests, and reviewer sign-off.