# Cutover Runbook

## Purpose
Convert a migration design into an executable, time-bound production cutover with explicit checkpoints, ownership, validation, and rollback.

## When to use
Use for every production migration where traffic, writes, DNS, data authority, integrations, or user access changes.

## Inputs
Migration procedure, dependency map, synchronization status, test evidence, change ticket, maintenance window, owners, rollback method, communication plan, and acceptance criteria.

## Preconditions
Rehearsal must be complete, prerequisites green, approvals obtained, and rollback assets available.

## Context to inspect
Inspect DNS TTLs, replication lag, queues, scheduled jobs, deployment freezes, monitoring dashboards, vendor contacts, support coverage, credentials, and source/target health.

## Core knowledge
A runbook is an operational control document. Steps need owners, expected duration, evidence, and abort thresholds. Irreversible actions should occur only after explicit gates.

## Procedure
1. Define T-minus prerequisites and final go/no-go criteria.
2. Assign a named owner to each action and decision.
3. Sequence traffic, application, data, DNS, integration, and validation steps.
4. Record expected durations and hard deadlines.
5. Define checkpoints before irreversible actions.
6. Specify exact validation evidence after each major transition.
7. Define rollback trigger, authority, and latest safe rollback time.
8. Include communication milestones and stakeholder channels.
9. Rehearse the runbook with production-like timing.
10. Correct ambiguous or parallel steps revealed by rehearsal.
11. Execute using one authoritative runbook.
12. Record timestamps, evidence, deviations, and decisions.
13. Enter stabilization only after acceptance criteria pass.

## Decision points
Use DNS switch, load-balancer weighting, feature flags, or routing changes according to architecture and rollback speed. Prefer progressive traffic where state and compatibility permit it.

## Common failure patterns
Runbook written as prose; no owners; hidden prerequisites; rollback described vaguely; DNS TTL unchanged; validation after all steps rather than checkpoints; irreversible source shutdown too early.

## Verification
A dry run demonstrates the sequence fits the window. During production execution, every checkpoint has recorded evidence and the final acceptance is explicitly signed off.

## Expected output
An executable cutover runbook with timestamps, owners, gates, validation, rollback thresholds, and communications.

## Stop conditions
Abort or escalate when prerequisite health changes, replication exceeds threshold, critical validation fails, the rollback deadline approaches, or required decision authority is unavailable.