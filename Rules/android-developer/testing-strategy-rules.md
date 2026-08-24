# Testing Strategy Rules

## Purpose
Provide risk-based, deterministic evidence that Android behavior remains correct.

## Scope
Applies to unit, integration, UI, contract, regression, and device tests.

## MUST
- Cover critical business rules and failure paths at the lowest reliable test layer.
- Add regression tests for material defects when a deterministic reproduction is practical.
- Keep tests isolated from uncontrolled time, network, randomness, and shared mutable state.
- Test lifecycle, persistence, permissions, and platform interactions at a layer capable of exercising them.
- Treat flaky tests as defects with ownership and remediation, not as normal noise.

## MUST NOT
- Use retries to conceal deterministic test failures.
- Assert implementation details when externally meaningful behavior can be asserted.
- Claim coverage from test count alone.

## SHOULD
- Maintain a balanced pyramid/portfolio favoring fast deterministic tests and targeted end-to-end coverage.
- Use fakes for controllability but retain integration evidence for real boundaries.

## Exceptions
A quarantined flaky test requires an owner, reason, impact assessment, and time-bounded remediation plan.

## Verification
Review CI history, flake rate, critical-path coverage, test determinism, mutation/coverage evidence where useful, and defect escape patterns.