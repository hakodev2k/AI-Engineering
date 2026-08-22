# Frontend Testing Rules
## Purpose
Provide reliable regression evidence at the cheapest meaningful test boundary.
## Scope
Unit, component, integration, visual, and end-to-end frontend tests.
## MUST
- Critical business behavior MUST have automated regression coverage at an appropriate boundary.
- Tests MUST assert externally meaningful behavior rather than incidental implementation details where practical.
- Tests MUST be deterministic and control time, network, randomness, and external state when those affect outcomes.
- Accessibility and failure states MUST be covered for critical workflows.
- A production defect fix SHOULD add regression evidence that would have detected the defect.
## MUST NOT
- Flaky tests MUST NOT be normalized through unbounded retries or permanent ignore flags.
- Snapshot volume MUST NOT substitute for behavior assertions.
## SHOULD
- Favor integration/component tests for UI behavior and reserve E2E tests for high-value cross-system journeys.
## Exceptions
Unautomatable behavior requires documented manual verification evidence.
## Verification
CI history, mutation/failure checks where useful, flaky-test trends, coverage of critical paths, and review of assertions.