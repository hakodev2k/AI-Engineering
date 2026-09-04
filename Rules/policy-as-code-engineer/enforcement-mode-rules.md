# Enforcement Mode Rules

## Purpose
Control how policy decisions transition between advisory, audit, shadow, and blocking enforcement without creating ambiguous protection.

## Scope
Applies to policy modes, fail-open/fail-closed behavior, warning-only controls, shadow evaluation, and enforcement transitions.

## MUST
- Every policy control MUST have an explicit enforcement mode for each protected environment or enforcement point.
- Blocking versus advisory behavior MUST be visible in configuration and operational telemetry.
- Transitions to stronger enforcement MUST define readiness evidence and expected impact.
- Fail-open or fail-closed behavior MUST be explicitly selected based on the risk of false allow versus false deny.
- Temporary non-blocking modes for mandatory controls MUST have an owner and expiry.

## MUST NOT
- Audit-only results MUST NOT be represented as enforced compliance.
- Enforcement mode MUST NOT change implicitly because evaluation fails or configuration is missing.
- High-risk controls MUST NOT remain indefinitely in warning mode without documented acceptance.

## SHOULD
- New controls SHOULD use shadow or audit mode when needed to establish false-positive rates before blocking.
- Mode configuration SHOULD be centrally discoverable and reviewable.

## Exceptions
Exceptions require reason, duration, affected controls, risk, compensating measures, and approval by the accountable control owner.

## Verification
Inspect mode configuration, tests for evaluator failure, telemetry, expiry records, and deployment history. Confirm observed runtime behavior matches the declared mode for each protected environment.