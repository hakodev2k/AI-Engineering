# Database Maintenance Automation

## Purpose
Automate recurring database maintenance safely so integrity, performance, backups, and housekeeping do not depend on manual intervention.

## When to use
Use when defining maintenance baselines, replacing fragile scripts, onboarding databases, or investigating maintenance-related regressions.

## Inputs
Engine capabilities, table/index sizes, workload windows, statistics needs, backup policy, integrity checks, retention tasks, and job history.

## Context to inspect
Inspect existing jobs, durations, overlap, failures, lock impact, resource consumption, alerting, and managed-service automation already provided.

## Core knowledge
Maintenance must solve observed engine needs. Generic nightly rebuild-everything jobs can consume resources, create logs, block workloads, and provide little benefit.

## Procedure
1. Inventory required maintenance and platform-managed tasks.
2. Remove redundant or cargo-cult operations.
3. Define frequency from workload and data-change characteristics.
4. Bound each task by time, resource, and object scope.
5. Schedule around critical workload where possible.
6. Make jobs restartable and safe after partial failure.
7. Capture duration, outcome, and affected objects.
8. Alert on failures and abnormal runtime.
9. Test maintenance impact under representative load.
10. Review policies as data volume changes.

## Decision points
Prefer adaptive maintenance based on fragmentation/change evidence over fixed blanket operations. Use managed automation when its behavior is transparent and meets objectives.

## Common failure patterns
Rebuilding every index, overlapping backup and maintenance IO, silent job failures, unbounded cleanup transactions, and no ownership.

## Verification
Review job history, resource impact, post-maintenance health, and failure-alert behavior.

## Expected output
An automated, observable maintenance schedule with rationale and bounded operational impact.

## Stop conditions
Escalate maintenance that requires prolonged blocking or cannot fit within service availability constraints.