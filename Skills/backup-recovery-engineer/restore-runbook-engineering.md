# Restore Runbook Engineering

## Purpose
Create executable recovery runbooks that reduce ambiguity, operator error, and recovery time during stressful incidents.

## When to use
Use for critical services, new backup platforms, major architecture changes, or after recovery exercises reveal manual uncertainty.

## Inputs
Architecture, backup catalog, dependency map, recovery objectives, access model, validation criteria, and escalation contacts.

## Context to inspect
Inspect actual commands/APIs, current resource names, prerequisites, permissions, clean-room requirements, and traffic cutover procedures.

## Core knowledge
A runbook must describe decisions as well as commands. Recovery is a controlled state transition requiring checkpoints, validation, rollback/cutover criteria, and evidence.

## Procedure
1. Define scenario and recovery goal.
2. State prerequisites, required roles, and safety warnings.
3. Define backup selection criteria.
4. Specify dependency recovery order.
5. Provide deterministic restore steps with expected observations.
6. Add checkpoints before destructive or irreversible actions.
7. Define technical and business validation.
8. Define traffic cutover and rollback criteria.
9. Record evidence and timestamps for RTO measurement.
10. Exercise the runbook with a different operator.
11. Revise unclear or stale steps.

## Decision points
Prefer automation for deterministic repetitive steps; retain human gates where data-loss or cutover decisions require judgment. Use scenario-specific runbooks when generic procedures become ambiguous.

## Common failure patterns
Commands without expected output; missing permissions; stale screenshots; no backup selection logic; validation reduced to service process running.

## Verification
A qualified engineer unfamiliar with the authoring process should execute the runbook successfully in a controlled exercise within target time.

## Expected output
A versioned, tested, operational recovery runbook.

## Stop conditions
Stop when prerequisites are unavailable, backup choice is uncertain, validation fails, or an irreversible action lacks required approval.