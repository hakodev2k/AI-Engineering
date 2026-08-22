# Testing Strategy Rules

## Purpose
Provide layered evidence that the complete product behavior is safe to change.
## Scope
Unit, integration, contract, component, E2E, regression, and failure testing.
## MUST
- Protect critical business invariants and integration boundaries with deterministic automated tests.
- Test authorization and failure paths, not only happy paths.
- Keep E2E coverage focused on high-value journeys while lower layers cover combinatorial logic.
## MUST NOT
- Accept flaky tests as permanent normal behavior.
- Mock away the boundary whose compatibility the test claims to verify.
## SHOULD
- Choose the lowest-cost test level that proves the intended behavior.
## Exceptions
Manual-only verification requires documented reason, evidence, and regression risk.
## Verification
Inspect CI stability, coverage of critical paths, test isolation, and defect escape patterns.