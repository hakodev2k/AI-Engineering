# Post-Incident Improvement

## Purpose
Turn incidents into durable system and organizational improvements without blame or superficial action lists.

## When to use
Use after significant incidents, repeated lower-severity failures, near misses, or operational events that reveal important system weaknesses.

## Inputs
Incident timeline, telemetry, changes, decisions, communications, architecture, runbooks, and responder observations.

## Context to inspect
Inspect technical conditions, organizational incentives, process gaps, tooling, alerting, workload, dependency behavior, and why existing safeguards did not prevent or limit impact.

## Core knowledge
Incidents usually emerge from interacting conditions rather than one human mistake. Strong reviews distinguish contributing factors from triggers and prioritize controls that change system behavior.

## Procedure
1. Reconstruct a factual timeline from evidence.
2. Describe customer and business impact.
3. Identify contributing technical and organizational conditions.
4. Examine why detection, containment, and recovery behaved as they did.
5. Identify what worked and should be preserved.
6. Generate corrective options at multiple layers.
7. Prioritize actions by risk reduction and recurrence likelihood.
8. Assign owners and completion evidence.
9. Track temporary mitigations until removed or made permanent.
10. Verify later that actions changed the relevant failure mode.

## Decision points
Prefer systemic controls, automation, safer defaults, and architecture changes over reminders or training when the same human error remains easy to repeat.

## Common failure patterns
Root cause equals person, five-whys used mechanically, dozens of low-value actions, no owners, closing actions without validation, and reviewing only catastrophic incidents.

## Verification
Verify the timeline is evidence-backed, material contributing factors are addressed, actions have owners and verification criteria, and recurrence risk is measurably reduced.

## Expected output
A blameless incident review with prioritized, testable improvement actions.

## Stop conditions
Escalate when the event involves security breach, legal exposure, safety concerns, or disciplinary matters requiring a separate governed process.