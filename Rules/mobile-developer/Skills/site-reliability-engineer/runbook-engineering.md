# Runbook Engineering

## Purpose
Create operational procedures that let responders diagnose and mitigate known failure modes safely and consistently.

## When to use
Use when introducing alerts, recurring incidents, manual recovery steps, or operational tasks that depend on tribal knowledge.

## Inputs
Alert definitions, incident history, service architecture, commands, dashboards, permissions, rollback paths, and escalation contacts.

## Preconditions
The procedure must be understood and testable outside an active emergency.

## Context to inspect
Ownership, dependencies, access requirements, failure symptoms, safe commands, rollback behavior, and expected recovery signals.

## Core knowledge
A useful runbook starts from a symptom and guides evidence gathering, bounded actions, verification, and escalation. It should reduce cognitive load without encouraging blind command execution.

## Procedure
1. Define the trigger and affected service.
2. State user impact and severity indicators.
3. Link the minimum dashboards and logs needed for diagnosis.
4. List likely failure modes in evidence-based order.
5. Provide safe diagnostic steps before mutation.
6. Document mitigations with prerequisites and blast radius.
7. Include rollback and verification after each change.
8. Define escalation and stop conditions.
9. Test the runbook in a game day or controlled incident.
10. Update after real use.

## Decision points
Automate deterministic low-risk steps; retain manual judgment where context changes risk. Split large runbooks by symptom rather than creating one encyclopedic document.

## Common failure patterns
Stale commands, missing permissions, no rollback, pages of theory before action, undocumented destructive effects, and links to dashboards that no longer exist.

## Verification
Have an engineer unfamiliar with the incident follow the runbook in a safe environment and verify expected evidence and outcomes.

## Expected output
A concise symptom-driven runbook with diagnosis, mitigation, verification, rollback, and escalation.

## Stop conditions
Stop when the procedure requires destructive actions, unavailable permissions, uncertain production state, or behavior outside documented failure modes.