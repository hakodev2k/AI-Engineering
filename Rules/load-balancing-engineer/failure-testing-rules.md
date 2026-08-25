# Failure Testing Rules

## Purpose
Validate that traffic systems behave as designed during backend, network, zone, dependency, and control-plane failures.

## Scope
Fault injection, failover drills, health-check tests, dependency failure, and recovery exercises.

## MUST
- Critical failure modes MUST be tested in a controlled environment or safely in production where authorized.
- Tests MUST define hypothesis, blast radius, abort conditions, expected behavior, and recovery verification.
- Failure testing MUST include capacity after failover, not merely successful traffic movement.
- Recovery behavior MUST be observed to detect flapping, thundering-herd reconnection, or uneven rebalance.
- Production fault injection MUST require explicit authorization and safeguards.

## MUST NOT
- MUST NOT run destructive or broad production failure experiments without approval.
- MUST NOT declare resilience from architecture diagrams alone.
- MUST NOT omit recovery validation after fault removal.

## SHOULD
- Exercise single-backend, zone, regional, DNS, certificate, and dependency failures according to the service threat model.
- Automate repeatable non-destructive resilience tests.

## Exceptions
When a failure cannot be safely injected, use staging, simulation, historical evidence, or analytical proof and document residual uncertainty.

## Verification
Retain experiment records, telemetry, recovery timing, capacity evidence, discovered gaps, and remediation status.