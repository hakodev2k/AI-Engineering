# Testing Strategy Rules
## Purpose
Ensure testing effort targets meaningful product and engineering risk.
## Scope
Unit, integration, contract, end-to-end, regression, and failure testing.
## MUST
- Critical behavior MUST have repeatable automated protection at the lowest effective test level.
- Integration boundaries and production-critical failure paths MUST be tested where mocks cannot establish confidence.
- Defect fixes MUST add regression protection when practical.
## MUST NOT
- Treat coverage percentage alone as evidence of correctness.
- Accept flaky tests as permanently normal CI behavior.
## SHOULD
- Optimize test portfolios for confidence, determinism, execution time, and maintenance cost.
## Exceptions
Unautomated critical scenarios require documented manual verification and automation rationale.
## Verification
Review test suites, CI history, flaky-test data, coverage of critical paths, and release evidence.