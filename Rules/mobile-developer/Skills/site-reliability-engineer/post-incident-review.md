# Post-Incident Review

## Purpose
Turn production incidents into durable reliability improvements without blame-driven analysis.

## When to use
Use after significant outages, repeated degradations, near misses, data-integrity events, or incidents that reveal systemic weaknesses.

## Inputs
Incident timeline, alerts, logs, traces, deployment history, decisions, communications, customer impact, and remediation notes.

## Preconditions
The incident should be stabilized and evidence preserved before review begins.

## Context to inspect
Detection, escalation, mitigation, contributing changes, dependency behavior, safeguards, runbooks, ownership, and prior related incidents.

## Core knowledge
A strong review explains how system conditions and decisions combined to produce impact. Root cause is rarely a single human action. Corrective actions should improve detection, prevention, containment, recovery, or organizational understanding.

## Procedure
1. Reconstruct a timestamped factual timeline.
2. Quantify customer and business impact.
3. Separate observations from assumptions.
4. Identify triggering events and contributing conditions.
5. Analyze why safeguards failed or did not exist.
6. Examine detection and mitigation delays.
7. Identify recurring patterns from previous incidents.
8. Generate corrective actions tied to observed failure mechanisms.
9. Rank actions by risk reduction and effort.
10. Assign owners and completion criteria.
11. Verify high-value actions after implementation.
12. Share reusable lessons with relevant teams.

## Decision points
Prioritize systemic controls over training-only actions. Use deeper causal analysis when the same failure class recurs. Avoid requiring every incident to produce many actions if evidence supports only a few meaningful fixes.

## Common failure patterns
Blaming an operator, vague actions such as “be more careful,” missing timelines, confusing trigger with root cause, and closing actions without verifying risk reduction.

## Verification
Confirm the timeline matches evidence, action items have owners and measurable completion criteria, and completed safeguards are tested against the original failure mode.

## Expected output
Blameless incident review, causal analysis, prioritized remediation, ownership, and verification evidence.

## Stop conditions
Escalate when the event involves legal, regulatory, security, HR, or customer-contract issues requiring specialized review.