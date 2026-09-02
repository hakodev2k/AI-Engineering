# Testing and Verification Rules

## Purpose
Require evidence that real-time behavior remains correct across nominal, boundary, and failure conditions.

## Scope
Unit, integration, hardware-in-the-loop, system, stress, soak, and regression testing.

## MUST
- Critical timing requirements MUST have repeatable verification at the most representative practical level.
- Tests MUST cover boundary load, burst load, timeout, clock, resource exhaustion, and dependency-failure cases relevant to the design.
- Timing regressions MUST be detected against explicit thresholds rather than subjective comparison.
- Test environments MUST document material differences from production hardware, scheduler, network, and compiler behavior.

## MUST NOT
- MUST NOT accept a passing functional test suite as proof of deadline compliance.
- MUST NOT mask flaky timing failures with unrestricted retries.

## SHOULD
- Use hardware-in-the-loop or production-equivalent targets for critical timing validation.

## Exceptions
Simulation-only evidence requires documented representativeness limits and approval proportional to risk.

## Verification
Review coverage traceability, test configurations, timing assertions, failure injection, regression history, and representative-target results.