# Resilience Testing Rules

## Purpose
Demonstrate that systems behave safely under failure instead of assuming resilience from design intent.

## Scope
Applies to component tests, integration tests, load tests, fault injection, disaster exercises, and production-safe experiments.

## MUST
- Critical resilience claims MUST have test evidence proportional to their impact.
- Tests MUST define hypothesis, injected condition, expected user/system behavior, safety bounds, and success criteria before execution.
- Tests involving production MUST have blast-radius controls, observability, abort criteria, and authorized approval.
- Recovery behavior MUST be tested as well as failure detection.
- Significant test findings MUST result in tracked remediation or explicit risk acceptance.

## MUST NOT
- MUST NOT inject destructive or uncontrolled faults into production without human authorization.
- MUST NOT call a test successful solely because the system did not crash; user outcomes and recovery criteria MUST be evaluated.
- MUST NOT run experiments when telemetry is insufficient to detect unsafe impact.

## SHOULD
- Tests SHOULD progress from isolated environments to increasingly realistic conditions.
- Repeated critical scenarios SHOULD be automated where safe and deterministic enough.

## Exceptions
A production experiment may be replaced by high-fidelity preproduction evidence when production risk is disproportionate; limitations MUST be documented.

## Verification
Inspect experiment plans, approvals, telemetry, test results, remediation records, and repeatability. Confirm evidence covers detection, containment, degradation, and recovery.