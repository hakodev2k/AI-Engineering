# Chaos Engineering Strategy

## Purpose
Establish a risk-driven chaos engineering program that improves resilience without turning fault injection into random breakage. This skill defines where chaos engineering creates value, how experiments map to business risk, and how evidence feeds engineering priorities.

## When to use
Use when starting or revising a resilience program, expanding chaos testing to new systems, or deciding where limited experiment capacity should be invested. Do not use chaos experiments as a substitute for basic testing, monitoring, backups, or incident response readiness.

## Inputs
Service inventory, critical user journeys, architecture diagrams, SLOs, incident history, dependency maps, recovery objectives, deployment topology, risk register, and ownership information.

## Preconditions
Critical services have identifiable owners, basic observability exists, and teams can stop or roll back experiments safely.

## Context to inspect
Business-critical flows, previous outages, concentration risks, hidden dependencies, single points of failure, recovery procedures, production guardrails, and existing reliability work.

## Core knowledge
Chaos engineering is disciplined experimentation on system behavior under adverse conditions. Senior practice prioritizes hypotheses that expose material resilience risk, limits blast radius, distinguishes planned experiments from incidents, and measures whether the system preserves an explicit steady state. The highest-value targets are often assumptions about redundancy, failover, retries, capacity, isolation, and operational recovery.

## Procedure
1. Identify critical business capabilities and their reliability objectives.
2. Rank failure risks by likelihood, impact, and uncertainty.
3. Map each risk to system components and dependencies.
4. Separate known weaknesses from untested assumptions.
5. Define program objectives such as failover confidence, dependency isolation, or recovery validation.
6. Select experiment classes that address the highest-value assumptions.
7. Define safety policies, production eligibility, approval thresholds, and rollback controls.
8. Establish evidence requirements and success metrics.
9. Plan a progression from local and staging experiments to controlled production experiments.
10. Integrate findings into engineering backlogs and reliability reviews.
11. Track repeat failures, unresolved risks, and resilience maturity over time.
12. Revisit priorities after major incidents or architecture changes.

## Decision points
Prefer lower-environment experiments for immature systems and production experiments when environment realism materially affects the hypothesis. Prefer narrow, repeatable experiments over broad game days when the failure mechanism is poorly understood.

## Common failure patterns
Running experiments without a hypothesis; choosing dramatic faults instead of important risks; measuring infrastructure survival rather than user outcomes; ignoring unresolved findings; expanding blast radius faster than safeguards mature; and treating the number of experiments as the success metric.

## Verification
Confirm the strategy links experiments to explicit risks, owners, measurable outcomes, and follow-up actions. Review whether critical services have meaningful coverage and whether prior experiment findings changed system behavior or operations.

## Expected output
A prioritized chaos program, eligibility rules, experiment categories, safety controls, evidence standards, and a review cadence.

## Stop conditions
Stop and escalate if critical ownership is unclear, monitoring cannot detect harm, rollback is unavailable, or business impact cannot be bounded.