# Post-Incident Detection Improvement

## Purpose
Convert incident evidence into durable improvements in telemetry, detections, triage, automation and response without overfitting to one intrusion.

## When to use
Use after confirmed incidents, material near misses or purple-team exercises.

## Inputs
Incident timeline, root cause, attacker behaviors, missed signals, alert outcomes, telemetry gaps and response delays.

## Context to inspect
Review what was observable at each attack stage, what controls fired, what analysts saw and where decision latency occurred.

## Core knowledge
The objective is systemic learning. Indicators expire; behavioral opportunities, telemetry fixes and workflow improvements often persist.

## Procedure
1. Reconstruct attacker behavior independent of product alerts.
2. Mark points where telemetry existed but no detection fired.
3. Mark missing or unusable telemetry separately.
4. Review alerts that fired but were missed or mis-triaged.
5. Identify response and handoff delays.
6. Propose behavior-based detections and test cases.
7. Improve enrichment/runbooks where analyst context was lacking.
8. Add automation only for deterministic bottlenecks.
9. Prioritize actions by recurrence risk and impact.
10. Assign owners and due dates.
11. Validate completed changes with replay or simulation.
12. Track residual gaps explicitly.

## Decision points
Do not create a new rule for every IOC. Prefer modifying an existing detection when it represents the same behavior and response path.

## Common failure patterns
IOC dumping; blaming analysts without workflow analysis; dozens of low-value rules; actions without owners; declaring closure before validation.

## Verification
Demonstrate that representative incident behavior now produces the intended telemetry, alert and response path.

## Expected output
Prioritized, validated improvement set linked to incident evidence and residual risk.

## Stop conditions
Escalate unresolved systemic risks that require architecture, budget or executive risk acceptance.