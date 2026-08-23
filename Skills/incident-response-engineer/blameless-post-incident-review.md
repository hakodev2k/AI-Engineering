# Blameless Post-Incident Review

## Purpose
Convert incident evidence into shared learning and durable system improvements without hiding accountability behind blame.

## When to use
Use after significant, recurring, surprising, or high-learning-value incidents.

## Inputs
Timeline, impact, causal analysis, response record, telemetry, customer effects, and proposed follow-up actions.

## Context to inspect
Inspect system incentives, operational procedures, ownership boundaries, prior known risks, safeguards, detection, and recovery capability.

## Core knowledge
Blameless analysis assumes actions made sense in their local context and asks what conditions shaped them. Accountability remains through clear ownership of improvements and risk decisions.

## Procedure
1. Define review scope and learning objectives.
2. Present verified impact and timeline.
3. Explain system behavior and causal factors.
4. Ask why safeguards, tests, alerts, or processes did not contain the failure.
5. Capture what worked well in detection and response.
6. Identify confusing interfaces and unsafe defaults.
7. Generate corrective actions tied to causal factors.
8. Prioritize actions by risk reduction and feasibility.
9. Assign owners and due dates or explicit risk acceptance.
10. Share lessons with teams that can reuse them.

## Decision points
Hold a full review when learning value or risk justifies the cost; use a lightweight review for low-impact well-understood incidents. Prefer actions that eliminate classes of failure over reminders or training alone.

## Common failure patterns
Blaming individuals, writing a narrative without actions, creating dozens of low-value tasks, hiding uncertainty, and failing to follow up on previous reviews.

## Verification
Confirm actions map to causal factors, have accountable owners, and are tracked to completion or documented acceptance.

## Expected output
A concise post-incident review containing impact, timeline, causes, response lessons, and prioritized corrective actions.

## Stop conditions
Escalate sensitive personnel, legal, regulatory, or security matters to appropriate processes rather than resolving them inside the technical review.