# Runbook Engineering

## Purpose
Create executable operational guidance for database incidents and maintenance so responders can act safely under pressure.

## When to use
Use for recurring alerts, critical failure modes, failover, recovery, maintenance, and privileged procedures.

## Inputs
Operational task, alert context, topology, commands, permissions, safety constraints, and escalation paths.

## Context to inspect
Existing automation, dashboards, dependencies, failure history, access requirements, and rollback procedures.

## Core knowledge
A useful runbook starts from observable symptoms, contains decision gates, protects against destructive actions, and defines verification—not merely command snippets.

## Procedure
1. Define trigger and intended outcome.
2. State prerequisites and required permissions.
3. Link diagnostic signals and dashboards.
4. Provide ordered diagnostic steps.
5. Add decision branches for common causes.
6. Mark destructive or irreversible actions explicitly.
7. Define rollback and escalation.
8. Specify recovery verification.
9. Exercise the runbook in a safe environment.
10. Update it after incidents and platform changes.

## Decision points
Automate deterministic low-risk steps; retain human approval for ambiguous or destructive decisions.

## Common failure patterns
Stale commands, missing prerequisites, copy-paste secrets, no verification, undocumented assumptions, and runbooks that require tribal knowledge.

## Verification
Have another qualified engineer execute a drill using only the runbook and record gaps.

## Expected output
A tested, versioned, safe operational runbook with triggers, decisions, commands, rollback, and verification.

## Stop conditions
Escalate when required actions exceed documented authority, are destructive, or depend on unavailable evidence.