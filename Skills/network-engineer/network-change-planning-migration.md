# Network Change Planning and Migration

## Purpose
Execute high-risk network changes with explicit dependencies, validation, rollback, and stakeholder control.

## When to use
Use for routing migrations, hardware refresh, firewall cutovers, WAN moves, cloud connectivity changes, or topology redesign.

## Inputs
Current/target designs, dependencies, configurations, traffic baselines, maintenance window, owners, test plan, rollback criteria, and access paths.

## Context to inspect
Management reachability, HA state, routing convergence, application dependencies, monitoring, backups, provider contacts, physical work, and concurrent changes.

## Core knowledge
Network changes can sever the tools needed to repair them. Preserve independent recovery access. A rollback plan must be executable from the failure state, not merely reverse the happy-path commands.

## Procedure
1. State objective, scope, success criteria, and non-goals.
2. Map affected services and failure domains.
3. Capture current configurations and operational baselines.
4. Validate target configuration offline/lab where practical.
5. Sequence prerequisites and dependency changes.
6. Define checkpoints after each reversible stage.
7. Establish explicit abort and rollback thresholds.
8. Confirm out-of-band access, backups, permissions, contacts, and monitoring.
9. Freeze conflicting changes.
10. Execute one bounded stage at a time.
11. Verify routing, forwarding, security, application paths, and telemetry at each checkpoint.
12. Roll back immediately when thresholds are breached.
13. Observe through a stabilization period and document deviations.

## Decision points
Prefer phased/canary migration over big-bang when coexistence is technically safe. Use parallel infrastructure when rollback speed and business criticality justify cost.

## Common failure patterns
Untested rollback, hidden dependencies, changing both ends simultaneously without access, stale diagrams, no baseline, optimistic timing, and declaring success after device configuration only.

## Verification
Compare pre/post route, session, traffic, latency, error, and application tests; confirm monitoring and redundancy remain healthy.

## Expected output
Approved implementation plan, command/config set, checkpoints, rollback, validation evidence, and final change record.

## Stop conditions
Stop when backup/OOB access is unavailable, prechecks fail, unexpected concurrent changes appear, rollback cannot be guaranteed, or success criteria cannot be measured.