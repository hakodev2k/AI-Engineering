# Recovery Incident Command

## Purpose
Provide disciplined technical coordination during major restore and disaster-recovery operations so teams make explicit decisions, preserve evidence, and avoid conflicting actions.

## When to use
Use during significant data-loss events, regional recovery, ransomware recovery, or prolonged service restoration.

## Inputs
Incident scope, business priorities, recovery objectives, runbooks, system owners, backup status, and communication channels.

## Context to inspect
Inspect current incident command structure, security/forensic constraints, dependency status, known-good recovery points, and change freezes.

## Core knowledge
Recovery engineering during an incident is a coordination problem as well as a technical one. Roles, decision logs, checkpoints, and a single source of truth reduce duplicated or destructive actions.

## Procedure
1. Confirm incident commander and recovery technical lead.
2. Establish authoritative timeline and status board.
3. Freeze conflicting changes where appropriate.
4. Prioritize services by business dependency and safety.
5. Assign recovery workstreams with clear owners.
6. Record backup selection and data-loss decisions.
7. Require checkpoints before destructive actions and cutovers.
8. Track actual RTO/RPO and blockers.
9. Coordinate validation with application, security, and business owners.
10. Hand off recovered services with explicit monitoring requirements.
11. Capture lessons and remediation after stabilization.

## Decision points
Centralize irreversible decisions; delegate reversible technical work. Favor correctness and trustworthiness over speed when recovery-point integrity is uncertain.

## Common failure patterns
Multiple teams restoring same system; undocumented decisions; changing recovery point midstream; status spread across private chats; premature declaration of recovery.

## Verification
Review decision log, ownership, timestamps, validation evidence, and business acceptance before closure.

## Expected output
Coordinated recovery with auditable decisions and controlled handoffs.

## Stop conditions
Escalate when authority is unclear, security investigation constrains recovery, teams disagree on trustworthy recovery point, or business approval is required for accepted data loss.