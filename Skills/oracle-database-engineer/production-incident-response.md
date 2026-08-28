# Production Incident Response

## Purpose
Handle Oracle production incidents safely by stabilizing service, preserving evidence, identifying root cause, and avoiding destructive guesswork.

## When to use
Use for outages, severe latency, ORA errors, blocking storms, storage/FRA exhaustion, corruption, replication failure, or cluster instability.

## Inputs
Incident timeline, symptoms, monitoring, alert/trace logs, recent changes, topology, recovery runbooks.

## Context to inspect
Database/instance status, alert log, sessions/waits, top SQL, blocking, CPU/memory, I/O, FRA/tablespaces, archive/redo, Data Guard/RAC, backups, and deployment events.

## Core knowledge
Incident response separates containment from root-cause remediation. Killing sessions, flushing caches, bouncing instances, or changing parameters can erase evidence and worsen recovery.

## Procedure
1. Confirm impact, scope, and incident ownership.
2. Freeze unrelated changes and record the timeline.
3. Check availability, resource exhaustion, and data-safety indicators.
4. Preserve key logs, session/wait evidence, plans, and recent-change records.
5. Identify dominant wait/resource/error signature.
6. Apply the lowest-risk reversible containment action.
7. Escalate immediately for suspected corruption or data-loss scenarios.
8. Validate service recovery with user-facing metrics.
9. Continue root-cause analysis after stabilization.
10. Produce corrective actions with owners and regression monitoring.

## Decision points
Prefer targeted session/job containment over instance restart when safe. Restore/fail over only under approved recovery criteria.

## Common failure patterns
Restart-first troubleshooting, deleting archive files to free space, mass session kills, changing many parameters, and declaring resolution when symptoms disappear.

## Verification
Confirm service SLIs, data consistency, replication/recovery health, and absence of recurring leading indicators.

## Expected output
An incident record with containment, evidence, root cause, and prevention actions.

## Stop conditions
Stop normal troubleshooting and escalate for corruption, potential data loss, security breach, or actions requiring destructive recovery.