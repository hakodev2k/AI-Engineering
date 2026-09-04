# Policy Testing Rules

## Purpose
Provide deterministic evidence that policy behavior matches intended controls across normal, boundary, and adversarial cases.

## Scope
Applies to unit tests, integration tests, regression suites, test data, decision matrices, and policy-engine compatibility tests.

## MUST
- Every material allow or deny path MUST have representative tests, including boundary and absence-of-data cases.
- Security-sensitive policies MUST include negative tests proving unauthorized or noncompliant inputs are rejected.
- Policy tests MUST pin or identify the evaluator behavior they depend on.
- Regression tests MUST be added for confirmed policy defects before or with the corrective change.
- Test fixtures MUST distinguish authoritative attributes from caller-controlled data.

## MUST NOT
- Tests MUST NOT rely on nondeterministic external state without controlled fixtures or explicit integration scope.
- A passing happy-path suite MUST NOT be treated as evidence of safe authorization or enforcement.
- Disabled tests for critical controls MUST NOT remain unexplained.

## SHOULD
- Table-driven tests SHOULD cover policy decision matrices efficiently.
- Property or fuzz testing SHOULD be used for complex input spaces where practical.

## Exceptions
Testing exceptions require documented risk, alternative evidence, affected policy paths, and reviewer approval for critical controls.

## Verification
Run the policy suite in CI, inspect branch/path coverage where meaningful, review negative cases, reproduce known incidents, and confirm tests fail when the protected rule is intentionally violated.