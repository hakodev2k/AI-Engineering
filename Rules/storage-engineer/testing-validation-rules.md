# Testing and Validation Rules

## Purpose
Validate storage behavior under normal, degraded, recovery, and upgrade conditions before relying on it in production.

## Scope
Functional, performance, failover, recovery, compatibility, and regression testing.

## MUST
- Critical storage changes MUST have tests proportional to blast radius and reversibility.
- Tests MUST include failure-state behavior when redundancy, failover, or recovery is part of the design claim.
- Test environments and methods MUST document material differences from production.
- Regression tests MUST protect previously observed high-impact failure modes when practical.

## MUST NOT
- MUST NOT use destructive tests against production data without explicit approval and isolation controls.
- MUST NOT infer recovery correctness solely from component health checks.
- MUST NOT accept flaky validation as evidence without bounding its cause and risk.

## SHOULD
- Automate deterministic health, integrity, failover, and performance checks where cost-effective.

## Exceptions
Production-only validation requires a staged plan, bounded blast radius, rollback, and approval.

## Verification
Inspect test plans, CI results, fault tests, recovery tests, environment assumptions, and recorded acceptance criteria.