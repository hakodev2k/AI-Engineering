# Incident Simulation and Game Days

## Purpose
Exercise incident detection, coordination, mitigation, and recovery under controlled conditions to expose weaknesses before real failures occur.

## When to use
Use for critical systems, new architectures, major failover mechanisms, on-call readiness, and validation of corrective actions.

## Inputs
Architecture, known failure modes, runbooks, safety constraints, test environment or production guardrails, observability, and participant roles.

## Context to inspect
Inspect business calendar, blast-radius controls, abort mechanisms, dependencies, data safety, access, and existing chaos or test tooling.

## Core knowledge
A useful game day tests hypotheses about resilience and response, not responder heroics. Experiments need explicit safety boundaries and observable success/failure criteria.

## Procedure
1. Choose a realistic high-value failure scenario.
2. Define learning objectives and expected system behavior.
3. Set blast-radius, duration, and abort limits.
4. Confirm backups, rollback, and responsible approvers.
5. Assign facilitators and observers separately from responders.
6. Introduce the failure using the safest representative mechanism.
7. Observe detection, paging, diagnosis, coordination, mitigation, and recovery.
8. Abort immediately if guardrails are crossed.
9. Compare observed behavior with assumptions and runbooks.
10. Record gaps and assign corrective actions.
11. Repeat after major fixes when validation is valuable.

## Decision points
Use production only when controls, maturity, and learning value justify it; otherwise use staging or simulation. Prefer realistic dependency and latency failures over arbitrary process termination when they better match risk.

## Common failure patterns
Surprise experiments without authorization, no abort criteria, testing only happy-path failover, measuring individuals instead of systems, and failing to implement lessons.

## Verification
Confirm objectives were exercised, safety limits held, observations are evidence-backed, and follow-up actions have owners.

## Expected output
A game-day report with scenario, guardrails, observations, response gaps, resilience findings, and actions.

## Stop conditions
Abort on unexpected customer impact, data-integrity risk, security concerns, or loss of experiment control.