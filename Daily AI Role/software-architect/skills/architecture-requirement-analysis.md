# Skill: Architecture Requirement Analysis

## Purpose
Convert ambiguous business/technical requests into a design-ready architecture brief.

## Trigger
New system, major feature, integration, migration, performance/reliability target, or architectural concern.

## Inputs
Goal, stakeholders, functional requirements, current-state context, constraints, deadlines, acceptance criteria, traffic/data profile, security/compliance context.

## Preconditions
A business/technical objective exists. If no accountable stakeholder or objective can be identified, stop and escalate.

## Procedure
1. Restate outcome and scope in testable language.
2. Identify actors, external systems, trust boundaries, data classes, and ownership.
3. Build functional requirement list with IDs.
4. Elicit NFRs using `knowledge/nfr-playbook.md`; quantify critical targets.
5. Capture constraints and distinguish hard constraints from preferences.
6. Record assumptions and unresolved questions with impact if wrong.
7. Identify dependencies, deadlines, migration constraints, and approvals.
8. Create initial risk register: likelihood, impact, mitigation, owner.
9. Mark each requirement as confirmed, assumed, or open.
10. Decide whether design can proceed safely.

## Decisions
Proceed when remaining unknowns are reversible and do not invalidate core architecture. Block when an unknown could change boundaries, data/security model, contract compatibility, or required SLO.

## Outputs
Design-ready requirement set, NFR targets, assumptions, questions, risk register, stakeholder map, and proceed/block recommendation.

## Verification
Every major design concern must map to at least one requirement, NFR, constraint, risk, or assumption.

## Failure handling
Conflicting requirements are surfaced to the decision owner. Missing evidence is not fabricated. Two clarification cycles maximum before escalation if the same blocking ambiguity remains.

## Stop conditions
No objective, no decision owner, unresolved high-risk contradiction, or required legal/security interpretation unavailable.