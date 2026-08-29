# Incident Program Coordination

## Purpose
Coordinate program-level response when a production incident, security event, or operational failure materially affects delivery commitments, launch readiness, or cross-team dependencies.

## When to use
Use when an incident has program-wide consequences beyond the immediate incident commander's technical response.

## Inputs
Incident summary, severity, affected systems, recovery estimate, program milestones, dependencies, stakeholder obligations.

## Context to inspect
Incident command structure, service ownership, business impact, customer commitments, current program critical path, and recovery plans.

## Core knowledge
The incident commander owns incident response. The Senior TPM protects program coherence around it by managing downstream impact, stakeholder communication, decision timing, and re-planning without interfering with technical command.

## Procedure
1. Confirm incident severity, authoritative source, and incident commander.
2. Identify affected program workstreams and dependencies.
3. Pause nonessential demands on responders.
4. Translate incident impact into milestone, risk, and resource implications.
5. Communicate program-level consequences to stakeholders.
6. Track decisions that depend on recovery evidence.
7. Reforecast schedules and readiness after stabilization.
8. Capture follow-up actions that affect program scope or architecture.
9. Integrate postmortem findings into risk and planning artifacts.

## Decision points
Defer launches when incident evidence undermines readiness assumptions. Avoid parallel program escalation that competes with established incident command.

## Common failure patterns
Creating duplicate command channels, demanding frequent status from responders, optimistic recovery assumptions, and failing to re-plan after stabilization.

## Verification
Confirm revised milestones and risks reflect actual recovery evidence and post-incident actions have owners.

## Expected output
A synchronized program response that preserves incident command while managing downstream consequences.

## Stop conditions
Stop direct coordination when incident command or security policy restricts information flow; escalate program decisions through authorized channels.