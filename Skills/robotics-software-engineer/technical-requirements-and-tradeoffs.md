# Technical Requirements and Trade-offs

## Purpose
Translate robotics product goals into measurable engineering requirements and make explicit architecture trade-offs across safety, latency, accuracy, compute, power, cost, reliability, and maintainability.

## When to use
Use when scoping a capability, reviewing architecture, selecting sensors/compute, planning milestones, or resolving disagreement between competing technical approaches.

## Inputs
- Mission goals and user workflows
- Safety constraints
- Environmental assumptions
- Hardware and cost constraints
- Performance targets
- Existing architecture and evidence

## Preconditions
Stakeholder goals must be distinguishable from proposed implementation details.

## Context to inspect
Inspect acceptance criteria, incident history, field data, latency/accuracy measurements, hardware limitations, power/thermal budgets, integration constraints, and prior architectural decisions.

## Core knowledge
Senior robotics decisions require systems thinking across coupled constraints: better perception may increase latency and power; higher control rates may increase CPU contention; redundancy can improve availability while complicating failure modes; tighter accuracy may require better calibration rather than more complex algorithms.

## Procedure
1. Restate the operational goal in observable terms.
2. Identify safety and regulatory constraints first.
3. Define measurable success metrics such as latency, accuracy, availability, intervention rate, or stopping distance.
4. Separate hard constraints from preferences.
5. Identify affected subsystems and interfaces.
6. Generate at least two viable alternatives for material decisions.
7. Compare alternatives across safety, performance, reliability, complexity, cost, power, and operability.
8. Validate uncertain assumptions with experiments or measurements.
9. Record the decision and rejected alternatives in an ADR or equivalent.
10. Define rollout, verification, and rollback criteria.
11. Revisit decisions when field evidence invalidates assumptions.

## Decision points
Prefer the simplest design that satisfies measured requirements and preserves future changeability. Optimize for whole-system mission performance rather than a subsystem benchmark. Accept additional complexity only when its benefit is demonstrated or required by risk.

## Common failure patterns
- Starting from a favorite technology instead of the mission need
- Requirements such as 'fast' or 'accurate' without thresholds
- Ignoring power, thermal, or compute constraints
- Architecture decisions based on desktop benchmarks
- No rollback or failure-mode analysis
- Treating assumptions as facts

## Verification
Confirm each requirement has a measurable acceptance method, key assumptions have evidence, trade-offs are documented, and the selected design passes representative system-level tests.

## Expected output
A decision record with measurable requirements, constraints, evaluated alternatives, evidence, risks, verification plan, and rollback criteria.

## Stop conditions
Stop when critical requirements conflict without an authorized priority decision, safety constraints are unresolved, evidence is insufficient for an irreversible choice, or the decision exceeds approved cost/risk authority.