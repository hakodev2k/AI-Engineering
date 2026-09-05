# Human Oversight and Contestability

## Purpose
Design and verify human oversight, intervention, appeal, and contestability mechanisms for AI-supported decisions and actions.

## When to use
Use for systems affecting rights, opportunities, safety, finances, employment, access, or other material outcomes.

## Inputs
Decision workflow, automation level, user journey, escalation paths, operator roles, latency constraints, audit logs, risk assessment.

## Preconditions
The AI system’s decision influence and available human roles are defined.

## Context to inspect
UX, authorization, case-management tools, operational procedures, training materials, notification text, audit trail, override mechanisms.

## Core knowledge
Human oversight is meaningful only when humans have authority, sufficient information, time, competence, and an independent way to challenge AI output. Rubber-stamping is not effective oversight.

## Procedure
1. Identify decisions requiring human review or override.
2. Define reviewer authority and independence.
3. Provide relevant evidence and model uncertainty.
4. Define escalation and second-review paths.
5. Design user notice and appeal mechanisms.
6. Prevent automation bias through workflow design.
7. Log AI recommendation, human decision, and rationale.
8. Train operators on limits and failure modes.
9. Test exceptional and time-critical cases.
10. Monitor override, appeal, and reversal rates.

## Decision points
Use mandatory pre-action review for irreversible high-impact actions; use post-action review only when delay would create greater harm and reversal is feasible.

## Common failure patterns
Nominal human approval with no real authority, hidden AI influence, insufficient review context, no appeal path, and no analysis of override behavior.

## Verification
Demonstrate that reviewers can reject AI recommendations and affected users can access the defined contestability process.

## Expected output
A documented oversight design with roles, thresholds, evidence, appeal paths, logs, training, and monitoring metrics.

## Stop conditions
Escalate when meaningful human review is legally or operationally required but cannot be provided.