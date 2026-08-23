# Defect Triage

## Purpose
Turn reported failures into reproducible, prioritized engineering work with clear impact and evidence.

## When to use
Use for incoming defects, production reports, regression failures, and quality backlogs.

## Inputs
Report, logs, environment, version, reproduction steps, business impact, telemetry.

## Context to inspect
Inspect affected users, frequency, severity, workaround, regression status, data/security implications, and recent changes.

## Core knowledge
Severity describes impact; priority describes action order. A defect can be rare but severe. Duplicate symptoms may have different causes.

## Procedure
1. Validate report provenance and affected version.
2. Reproduce or gather sufficient evidence.
3. Minimize the scenario.
4. Classify impact, frequency, and blast radius.
5. Check security, privacy, and data-loss implications.
6. Search related defects and changes.
7. Assign severity independently from priority.
8. Identify owner and immediate containment if needed.
9. Record objective acceptance evidence for the fix.
10. Feed recurring patterns into prevention work.

## Decision points
Escalate immediately for security, data loss, safety, or widespread outage; batch cosmetic low-impact defects when appropriate.

## Common failure patterns
Priority based on reporter seniority, vague reproduction steps, premature root-cause claims, and closing on implementation without verification.

## Verification
Confirm reproducibility/evidence, classification rationale, ownership, and fix-validation criteria.

## Expected output
A triaged defect with actionable evidence and risk-based priority.

## Stop conditions
Escalate when investigation requires restricted production data or incident response.