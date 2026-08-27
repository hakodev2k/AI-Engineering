# SQL Agent Automation

## Purpose
Build reliable SQL Server Agent automation with explicit ownership, retries, observability, and failure handling.

## When to use
Use for backups, maintenance, ETL orchestration, integrity checks, or operational database jobs.

## Inputs
Task requirements, schedule, dependencies, credentials, runtime expectations, failure policy, notification channels.

## Context to inspect
Inspect Agent service account, proxies, job owners, schedules, step subsystems, output logging, concurrency, and downstream dependencies.

## Core knowledge
A scheduled job is a production service dependency. Idempotency, bounded retries, least privilege, and visible failure states matter more than merely making the happy path run.

## Procedure
1. Define success, failure, timeout, and ownership.
2. Make steps idempotent where feasible.
3. Assign least-privilege execution context.
4. Separate logically recoverable steps.
5. Add bounded retry only for transient failure classes.
6. Persist useful output and run metadata.
7. Configure alerts/escalation.
8. Test partial failure and rerun behavior.
9. Check schedule collisions and capacity.
10. Document manual recovery.

## Decision points
Use Agent for database-local operational automation; use an external orchestrator when cross-system dependencies, richer state, or enterprise scheduling dominate.

## Common failure patterns
Jobs owned by departing users, silent failures, unlimited retry loops, overlapping runs, embedded secrets, and non-idempotent reruns.

## Verification
Force controlled failures, confirm alerts and recovery behavior, then verify normal execution and runtime within the expected window.

## Expected output
Reliable job definition, permissions, telemetry, recovery procedure, and tested failure behavior.

## Stop conditions
Stop if credentials, ownership, or destructive rerun semantics are unresolved.