# Robustness and Resilience Rules

## Purpose
Ensure model behavior remains acceptably safe and reliable under realistic variation, degradation, and stress.

## Scope
Applies to input perturbations, distribution shift, dependency failures, adversarial conditions, degraded context, and operational stress.

## MUST
- Validation MUST include realistic perturbations and degraded conditions that could materially affect outcomes.
- Critical workflows MUST define acceptable behavior when model confidence, context quality, dependencies, or inputs degrade.
- Systems MUST fail safely when model behavior cannot be trusted sufficiently for the intended action.
- Known robustness limits MUST be reflected in release criteria and operational controls.
- Material resilience claims MUST be supported by test evidence rather than assumptions.

## MUST NOT
- A model MUST NOT be considered robust solely because average benchmark accuracy is high.
- Fallback behavior MUST NOT silently increase user or operational risk.

## SHOULD
- Stress testing SHOULD cover malformed, ambiguous, out-of-distribution, and dependency-failure scenarios where relevant.
- Robustness tests SHOULD be rerun after material model or system changes.

## Exceptions
When a stress scenario cannot be reproduced safely, use simulation or bounded testing and document residual uncertainty and compensating controls.

## Verification
Inspect stress-test suites, fallback tests, failure-injection results, release criteria, and production incident evidence.