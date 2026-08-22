# Postmortem and Root-Cause Analysis

## Purpose
Turn incidents into durable engineering improvements without blame-driven conclusions.

## When to use
Use after significant incidents, repeated operational failures, or costly near misses.

## Inputs
Incident timeline, telemetry, changes, communications, tickets, runbooks, system architecture.

## Context to inspect
What happened before, during, and after impact; detection gaps; contributing technical and process factors; previous similar incidents.

## Core knowledge
Root cause is rarely a single human action. Distinguish trigger, contributing conditions, detection failure, mitigation delays, and systemic weaknesses.

## Procedure
1. Reconstruct timeline from evidence.
2. Define customer and business impact.
3. Identify trigger and enabling conditions.
4. Explain why defenses did not prevent impact.
5. Explain detection and recovery delays.
6. Compare with prior incidents.
7. Create actions that change system behavior.
8. Rank actions by risk reduction and effort.
9. Assign owner and due date.
10. Verify completion later.

## Decision points
Prefer automation/guardrails over reminders; fix recurring systemic issues before rare edge cases; separate immediate remediation from strategic work.

## Common failure patterns
Stopping at operator error, vague actions, no owner, no evidence, hiding uncertainty, actions that only add documentation.

## Verification
Timeline is evidence-backed, actions map to failure modes, and completed actions are tested against recurrence scenarios.

## Expected output
Blameless postmortem with causal model and measurable corrective actions.

## Stop conditions
Stop if evidence is insufficient to assert a cause; record uncertainty instead.