# Defect Triage

## Purpose
Prioritize defects using user impact, business risk, recurrence, workaround quality, and opportunity cost rather than severity labels alone.

## When to use
Use for incoming production defects, regression queues, release decisions, and recurring quality issues.

## Inputs
Defect report, reproduction evidence, affected users, frequency, business impact, logs or telemetry summaries, workaround, and fix risk.

## Context to inspect
Inspect expected behavior, recent changes, affected journeys, data integrity, security implications, support volume, and related incidents.

## Core knowledge
Severity describes impact; priority describes when to act. A rare data-loss defect can outrank a frequent cosmetic issue. Repeated defects may indicate systemic quality work rather than isolated fixes.

## Procedure
1. Confirm the observed behavior and expected outcome.
2. Determine affected users and frequency.
3. Assess data, financial, security, compliance, and trust impact.
4. Evaluate workaround availability and cost.
5. Identify release or roadmap interactions.
6. Assign priority using consistent criteria.
7. Define acceptance for the fix and regression protection.
8. Group recurring symptoms when a common cause is suspected.
9. Communicate user-facing impact and workaround.
10. Reprioritize when new evidence changes impact.

## Decision points
Fix immediately for intolerable risk; schedule normally for bounded impact; monitor when evidence is weak and a safe workaround exists.

## Common failure patterns
Priority equals severity, loudest customer wins, fixing symptoms repeatedly, no regression criteria, and closing issues because they cannot be reproduced once.

## Verification
Priority rationale is evidence-based, critical risks are escalated, and resolved defects include verification of expected behavior.

## Expected output
A triaged defect with priority, impact rationale, acceptance criteria, and next action.

## Stop conditions
Escalate immediately for suspected security incidents, privacy breaches, safety issues, or material data corruption.