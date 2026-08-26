# Database Cutover Planning

## Purpose
Design a controlled transition from source to target with explicit sequencing, ownership, gates, and fallback.

## When to use
Use before every production migration cutover, including nominally zero-downtime migrations.

## Inputs
Migration strategy, rehearsal timings, dependency map, DNS/connection configuration, replication state, validation gates, maintenance window, rollback plan, and contact roster.

## Core knowledge
Cutover is a coordinated state transition, not merely changing a connection string. Writes, queues, jobs, caches, connection pools, secrets, routing, and monitoring can all affect correctness.

## Procedure
1. Define entry criteria and go/no-go authority.
2. Create a minute-level runbook with owners.
3. Freeze risky schema/config changes.
4. Define write quiescence or final synchronization mechanism.
5. Drain or account for jobs and queues.
6. Capture final source position and reconcile target.
7. Switch secrets, routing, or application configuration in controlled order.
8. Restart/refresh connection pools where necessary.
9. Execute smoke and business validation.
10. Observe predefined health gates before declaring success.
11. Preserve source according to rollback policy.

## Decision points
Prefer reversible routing changes and staged consumer activation when architecture permits. Extend validation rather than rush when evidence is ambiguous.

## Common failure patterns
No owner per step, forgotten background writers, stale connection pools, premature source shutdown, and undefined go/no-go criteria.

## Verification
A rehearsal must prove sequence and timing; production cutover must satisfy all explicit gates.

## Expected output
An executable, timed cutover runbook and decision matrix.

## Stop conditions
Stop when entry criteria fail, synchronization is not current, critical owners are unavailable, or rollback readiness is not proven.