# Maintenance Automation

## Purpose
Automate recurring database maintenance safely, observably, and with bounded production impact.

## When to use
Use for statistics, vacuum/compaction, index maintenance, partition lifecycle, backups, checks, and cleanup jobs.

## Inputs
Engine maintenance requirements, workload windows, resource limits, object sizes, and operational policies.

## Context to inspect
Existing jobs, schedules, lock behavior, replication, storage, job history, alerts, and overlapping maintenance.

## Core knowledge
Maintenance should be adaptive to actual need rather than blindly scheduled. Automation requires idempotency, concurrency guards, budgets, and clear failure handling.

## Procedure
1. Inventory required maintenance and current automation.
2. Define measurable trigger conditions.
3. Estimate resource and lock impact.
4. Add concurrency and time limits.
5. Make operations resumable or idempotent where possible.
6. Schedule around workload constraints.
7. Emit structured execution metrics and logs.
8. Alert only on actionable failures or overdue work.
9. Test interruption and retry behavior.

## Decision points
Use condition-based maintenance when engine telemetry supports it; use fixed schedules only where predictable and justified.

## Common failure patterns
Rebuilding everything nightly, overlapping jobs, no timeout, unbounded retries, maintenance during peak load, and silent failures.

## Verification
Review job history, resource impact, lock duration, backlog, and recovery after intentional interruption.

## Expected output
Reliable maintenance automation with triggers, limits, telemetry, and runbooks.

## Stop conditions
Escalate when maintenance requires blocking operations beyond approved windows or automation lacks safe cancellation.