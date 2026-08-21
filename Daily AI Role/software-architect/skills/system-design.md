# Skill: System Design

## Purpose
Produce an implementable architecture with explicit trade-offs, failure behavior, and verification.

## Inputs
Design-ready requirements, current architecture, standards, NFR targets, constraints, risk register.

## Procedure
1. Define system context, actors, ownership, and boundaries.
2. Model primary flows, state transitions, data ownership, consistency needs, and trust boundaries.
3. Identify peak workload, scale assumptions, latency paths, availability dependencies, and recovery objectives.
4. Generate options. For high-impact irreversible choices, include at least two credible alternatives.
5. Compare options on correctness, complexity, reliability, security, performance, operability, cost, migration, and reversibility.
6. Select a recommended option and record ADRs for consequential choices.
7. Define interfaces/contracts, versioning, idempotency, timeout/retry policy, data lifecycle, and failure handling.
8. Define deployment topology, observability, alerts, runbook needs, rollout, rollback, and migration checkpoints.
9. Request parallel security, reliability, and cost/performance reviews after the shared baseline is stable.
10. Consolidate findings and update the design.
11. Define verification: tests, load/failure experiments, telemetry, reconciliation, acceptance metrics.

## Quality criteria
Traceable requirements, quantified critical NFRs, no unexplained single points of failure for required availability, explicit trust/data boundaries, realistic rollout/rollback, actionable observability, and implementable interfaces.

## Failure handling
If evidence invalidates a core assumption, return to requirement analysis or option generation rather than patching the chosen design.

## Stop conditions
Blocking NFR conflict, unacceptable residual risk, unavailable required approval, or no feasible option within constraints.