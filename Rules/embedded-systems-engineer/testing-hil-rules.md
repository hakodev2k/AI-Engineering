# Testing and Hardware-in-the-Loop Rules

## Purpose
Provide deterministic regression evidence from logic through real hardware behavior.

## Scope
Unit, integration, simulation, SIL, HIL, bench, regression, and fault-injection testing.

## MUST
- Test critical business/control logic independently of hardware where feasible and validate hardware-dependent behavior on representative targets.
- Cover boundary, timeout, reset, fault, and recovery paths for critical components.
- Make automated tests deterministic and identify hardware/environment assumptions.

## MUST NOT
- Treat simulator success as sufficient evidence for electrical or timing behavior requiring real hardware.
- Hide flaky tests with unconditional retries.

## SHOULD
- Maintain a layered test strategy that minimizes expensive HIL while preserving target evidence.

## Exceptions
Unautomated critical tests require documented procedure, evidence, and ownership.

## Verification
Review CI results, HIL logs, test coverage of critical requirements, fault injection, and reproducibility.