# Architecture Requirements and NFRs

## Purpose
Translate business goals and non-functional requirements into explicit software architecture constraints and measurable quality targets.

## When to use
Use when starting a system, redesigning a critical subsystem, or when reliability, latency, security, scalability, maintainability, or cost expectations are unclear.

## Inputs
Requirements, stakeholders, expected traffic, data sensitivity, availability targets, regulatory constraints, current architecture, incident history.

## Preconditions
Critical stakeholders and system scope are identifiable. Do not invent missing NFRs as facts.

## Context to inspect
Existing SLAs/SLOs, deployment model, dependencies, bottlenecks, data flows, failure history, team capability, budget constraints.

## Core knowledge
Architecture exists to satisfy quality attributes under constraints. NFRs should be measurable and prioritized because qualities often conflict: stronger consistency may reduce availability; stronger isolation may increase cost and complexity.

## Procedure
1. Identify business-critical user journeys.
2. Capture functional scope and system boundaries.
3. Elicit measurable NFRs for availability, latency, throughput, security, recovery, operability, maintainability, and cost.
4. Rank NFRs by business impact.
5. Identify conflicts and constraints.
6. Map each high-priority NFR to architectural tactics.
7. Define acceptance metrics and validation methods.
8. Record assumptions and unresolved risks.
9. Review with technical and business stakeholders.

## Decision points
Prefer measurable targets over vague goals. Relax low-value NFRs when their cost outweighs business benefit. Escalate mutually incompatible requirements.

## Common failure patterns
Vague goals such as “highly scalable”; treating all NFRs as equally important; ignoring operational constraints; optimizing before measuring; undocumented assumptions.

## Verification
Confirm every critical NFR has an owner, metric, target, architecture response, and validation plan.

## Expected output
A prioritized architecture requirement set with measurable quality targets, trade-offs, assumptions, and validation criteria.

## Stop conditions
Stop when key business goals are missing, critical NFRs conflict without stakeholder resolution, or required evidence cannot be obtained.