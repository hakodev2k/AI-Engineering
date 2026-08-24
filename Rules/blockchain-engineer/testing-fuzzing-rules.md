# Testing and Fuzzing

## Purpose
Provide evidence that protocol behavior remains correct across normal and adversarial state spaces.

## Scope
Unit, integration, property, fuzz, invariant, fork, and end-to-end blockchain tests.

## MUST
- Test critical invariants rather than only example outputs.
- Cover unauthorized access, malformed inputs, external-call failures, boundary arithmetic, and lifecycle transitions.
- Use deterministic seeds or preserve failing seeds for reproducibility.
- Add regression tests for every material production or audit defect.
- Test deployed-network assumptions with fork or equivalent integration tests when local mocks are insufficient.

## MUST NOT
- Hide flaky or failing security tests behind retries.
- Mock away the behavior under investigation.
- Treat high line coverage as proof of protocol correctness.

## SHOULD
- Use stateful fuzzing for protocols with complex sequences.
- Separate fast CI tests from deeper scheduled campaigns without omitting critical gates.

## Exceptions
Untestable properties require documented manual evidence and risk acceptance.

## Verification
Inspect CI results, invariant definitions, fuzz duration/seeds, regression suites, and failure reproducibility.