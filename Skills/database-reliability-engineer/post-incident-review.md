# Post-Incident Review

## Purpose
Convert database incidents into durable reliability improvements without reducing analysis to individual blame.

## When to use
Use after material outages, data-loss events, severe performance degradation, failed changes, or meaningful near misses.

## Inputs
Incident timeline, telemetry, logs, changes, communications, mitigations, customer impact, and responder notes.

## Context to inspect
Technical failure chain, detection, escalation, decision points, safeguards, runbooks, tests, architecture, and organizational conditions.

## Core knowledge
A strong review distinguishes trigger from contributing conditions and systemic causes. Actions should reduce recurrence probability, blast radius, or recovery time.

## Procedure
1. Build an evidence-backed timeline.
2. Quantify user and data impact.
3. Identify the initiating event.
4. Trace technical and operational contributing factors.
5. Evaluate detection and response effectiveness.
6. Identify safeguards that failed or were absent.
7. Generate corrective options at multiple layers.
8. Prioritize actions by risk reduction and effort.
9. Assign owners and completion criteria.
10. Verify completed actions and update runbooks/tests.

## Decision points
Prefer systemic controls over reminders or retraining when automation, architecture, or guardrails can prevent recurrence.

## Common failure patterns
Blaming operators, stopping at the first cause, vague actions such as 'monitor better', no owners, and never verifying follow-up work.

## Verification
Confirm timeline evidence, stakeholder review, actionable owners, measurable completion criteria, and later closure of high-priority actions.

## Expected output
A blameless, evidence-based review with causal analysis, lessons, and tracked reliability improvements.

## Stop conditions
Escalate when evidence is incomplete for strong claims, legal/security review is required, or sensitive personnel matters arise.